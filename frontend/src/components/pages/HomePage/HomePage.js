import React from 'react';
import { PageTemplate, PolyBackground, Block } from '../../../components';
import { HeaderContainer } from '../../../containers';


const HomePage = () => {
  return (
    <PageTemplate 
      header={<HeaderContainer/>}>
      <PolyBackground>
        <Block center shadow>
          <h1> 
            CoinMarket - Exchange The World
          </h1> 
        </Block>
      </PolyBackground>
    </PageTemplate>
  );
};

export default HomePage;

