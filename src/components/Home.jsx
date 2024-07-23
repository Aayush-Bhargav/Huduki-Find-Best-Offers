import React from 'react';
import Offers from "../components/Offers";
import RestaurantsNearby from './RestaurantsNearby';
import Clients from './Clients';

const Home = () => {//Home Page component
  
  return (
    <div>
      <Offers />
      <RestaurantsNearby />
      <Clients />
    </div>
  )
}
export default Home;
