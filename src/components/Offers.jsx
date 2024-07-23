import React from 'react'
import "../Home.css"
import { useContext, useEffect } from 'react';
import RestaurantContext from '../context/RestaurantContext';
import RestaurantState from '../context/RestaurantState';
const Offers = () => {
  const { fetchRestaurants, restaurants, display, images, startLoading, finishLoading, handleProgress } = useContext(RestaurantContext);


  useEffect(() => {
    const fetchData = async () => {
      try {

        await fetchRestaurants(); // Ensure fetchRestaurants keeps the restaurants updated


      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };


    fetchData(); // Fetch the restaurants

  }, [restaurants.length]);
  console.log('image length:', images.length)
  return (
    <div className=' image-loop'>
      <h4 className='poppins-semibold' style={{marginBottom:"8px",marginTop:"24px"}}>Trending Offers 🥳</h4>
      {/* if number of images is less than 4 then don't animate */}
      {images.length < 4 ? (<div className='center-display'>{images.length === 1 && (
        <img src={`/images/${restaurants[0].image1}`} alt="Offer 1 Here" key={restaurants[0]._id} />
      )}
        {images.length === 2 && (
          <>
            <img src={`/images/${restaurants[0].image1}`} alt="Offer 1 Here" key={restaurants[0]._id} />

            {restaurants[0].image2 ? <img src={`/images/${restaurants[0].image2}`} alt="Offer 2 Here" key={restaurants[0]._id} /> : <img src={`/images/${restaurants[1].image1}`} alt="Offer 1 Here" key={restaurants[1]._id} />}
          </>
        )}
        {images.length === 3 && (
          <>
            <img src={`/images/${restaurants[0].image1}`} alt="Logo Here" key={restaurants[0]._id} />
            {restaurants[0].image2 ? (<><img src={`/images/${restaurants[0].image2}`} alt="Logo Here" key={restaurants[0]._id} />
              <img src={`/images/${restaurants[1].image1}`} alt="Logo Here" key={restaurants[1]._id} /></>) : (<><img src={`/images/${restaurants[1].image1}`} alt="Logo Here" key={restaurants[1]._id} />{restaurants[1].image2 ? <img src={`/images/${restaurants[1].image2}`} alt="Logo Here" key={restaurants[1]._id} /> : <img src={`/images/${restaurants[2].image1}`} alt="Logo Here" key={restaurants[2]._id} />}</>)}
          </>

        )}</div>) : (<><div className='logos-slide'>{restaurants.map((restaurant) => {

          return (<><img src={`/images/${restaurant.image1}`} alt="Logo Here" key={restaurant._id} />{restaurant.image2 && <img src={`/images/${restaurant.image2}`} alt="Logo Here" key={restaurant._id} />}</>);

        })}</div><div className='logos-slide'>{restaurants.map((restaurant) => {

          return (<><img src={`/images/${restaurant.image1}`} alt="Logo Here" key={restaurant._id} />{restaurant.image2 && <img src={`/images/${restaurant.image2}`} alt="Logo Here" key={restaurant._id} />}</>);
        })}</div></>)}
    </div>
  );
}
export default Offers;
