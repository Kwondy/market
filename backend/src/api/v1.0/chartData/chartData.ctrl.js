const log = require('../../../lib/log');
const ChartData = require('../../../db/models/ChartData');
const Joi = require('joi');
const poloniex = require('../../../lib/poloniex');
// const cache = require('../../../lib/cache');

exports.getChartData = async (ctx) => {
  const { period } = ctx.query;

  if(!period) {
    ctx.body = {
      message: 'type is missing'
    };
    ctx.status = 400; 
  }
  const { name } = ctx.params;
  try{
    const data = await ChartData.findByNameAndPeriod(name, period);
    ctx.body = data;
  } catch (e) {
    ctx.throw(e, 500);
  }
}; 