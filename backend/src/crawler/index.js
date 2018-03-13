require('dotenv').config();
const db = require('../db');
const poloniex = require('../lib/poloniex');
const ExchangeRate = require('../db/models/ExchangeRate');
const ChartData = require('../db/models/ChartData');
const socket = require('./socket');
const progress = require('cli-progress'); 
const { parseJSON, polyfill } = require('../lib/common');
const log = require('../lib/log');
const currencyPairMap = require('../lib/poloniex/currencyPairMap');
const Worket = require('./worker');
// const redis = require('redis');
const config = require('./config.json');

// const publisher = redis.createClient();

const initialize = async () => {
  await db.connect();
  // await registerInitialExchangeRate();
  // socket.connect();
  await ChartData.drop();
  await importData();
  const current = (new Date()) / 1000;
  await importData(300, (new Date() / 1000) - 60 * 60 * 24 * 30);
  await importData(300, current);
  socket.connect();
};

async function registerInitialExchangeRate() {
  const tickers = await poloniex.getTickers();

  // removes all the data from the collection (only for temporary use)
  await ExchangeRate.drop();
  log('dropped exchangerate collection');
  const keys = Object.keys(tickers);
  const promises = keys.map(
    key => {
      const ticker = tickers[key];
      
      if (!currencyPairMap[ticker.id.toString()]) {
        return Promise.resolve();
      }

      const data = Object.assign({name: key}, ticker);
      const exchangeRate = new ExchangeRate(data);
      return exchangeRate.save();
    }
  );

  try {
    await Promise.all(promises);
  } catch (e) {
    console.log(e);
  }

  console.log('succeed!');
}

async function importData(period, start) {
//   const test = new ChartData({name: 'hellomttt'});
//   try {
//     await test.save();
//   } catch (e) {
//     console.log('errorrrr');
//   }
//   console.log('okkkkkk');   
//   return;
// }
 
  log('reloading chart data....');
  const bar = new progress.Bar({}, progress.Presets.shades_classic);
  const currencyPairs = [];
  let current = 0;
  for(let key in currencyPairMap) {
    currencyPairs.push(currencyPairMap[key]);
  }

  bar.start(currencyPairs.length, 0);
  bar.update(0);
  const requests = currencyPairs.map((currencyPair) => () => poloniex.getChartData(currencyPair).then(
    (data) => ChartData.massImport(currencyPair, data)
  ));

  for(let i = 0; i < Math.ceil(currencyPairs.length / 10); i++) {
    const promises = requests.slice(i * 10, i * 10 + 10).map(thunk => thunk());
    try {
      await Promise.all(promises);
      current += promises.length;
      bar.update(current);
    } catch (e) {
      console.log('error!');
    }
  }
  bar.stop(); 
}

async function updateEntireRate() {
  log('updating entire rate...');
  const tickers = await poloniex.getTickers();
  const keys = Object.keys(tickers);

  const promises = keys.map(
    key => {
      return ExchangeRate.updateTicker(key, tickers[key]);
    }
  );

  try {
    await Promise.all(promises);
  } catch (e) {
    log.error('Oops, failed to update entire rate!');
    return;
  }

  log('done');
}

const messageHandler = {
  1002: async (data) => {
    if (!data) return;
    const converted = poloniex.convertToTickerObject(data);
    const { name, ...rest } = converted;
    if(!name) return;
    if(name === 'NULL_NULL') return;
    
    try {
      await ExchangeRate.updateTicker(name, rest);
      
      const { last, percentChange, baseVolume, quoteVolume } = converted;
      const payload = {
        name, 
        last: parseFloat(last), 
        percentChange: parseFloat(percentChange), 
        baseVolume: parseFloat(baseVolume), 
        quoteVolume: parseFloat(quoteVolume), 
        lastUpdated: new Date()
      };
      // publisher.publish('general', JSON.stringify({
      //   type: 'TICKER',
      //   payload
      // }));
      // log('Updated', name);
    } catch (e) {
      console.error(e);
    }
  }
};

socket.handleMessage = (message) => {
  const parsed = parseJSON(message);
  if (!parsed) {
    return null;
  }

  const [type, meta, data] = parsed;
  if (messageHandler[type]) {
    messageHandler[type](data);
  }
};

socket.handleRefresh = () => {
  updateEntireRate();
};

initialize();