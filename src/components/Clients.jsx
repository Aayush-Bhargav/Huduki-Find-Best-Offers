import React from 'react'
import "../Home.css"
import { useContext, useEffect } from 'react';
import RestaurantContext from '../context/RestaurantContext';
import RestaurantState from '../context/RestaurantState';

const Clients = () => {
    const { fetchRestaurants, restaurants, display, logos } = useContext(RestaurantContext);
    console.log('Logos length:', logos.length);
    useEffect(() => {
        fetchRestaurants();
    }, [restaurants.length])
    return (
        <div style={{ marginTop: "30px" }}>
            <div className=' image-loop'>
                <h4 className='poppins-semibold' style={{marginBottom:"8px",marginTop:"24px"}}>Our Clients</h4>
                {/* if number of logos is less than 4 then don't animate */}
                {logos.length < 4 ? (<div className='center-display' >{logos.length === 1 && (
                    <img src={`/images/${restaurants[0].logo}`} alt="Logo Here" key={restaurants[0]._id} />
                )}
                    {logos.length === 2 && (
                        <>
                            <img src={`/images/${restaurants[0].logo}`} alt="Logo Here" key={restaurants[0]._id} />

                            <img src={`/images/${restaurants[1].logo}`} alt="Logo Here" key={restaurants[1]._id} />
                        </>
                    )}
                    {logos.length === 3 && (
                        <>
                            <img src={`/images/${restaurants[0].logo}`} alt="Logo Here" key={restaurants[0]._id} />
                            <img src={`/images/${restaurants[1].logo}`} alt="Logo Here" key={restaurants[1]._id} />
                            <img src={`/images/${restaurants[2].logo}`} alt="Logo Here" key={restaurants[2]._id} />
                        </>
                    )}</div>) : (<><div className='logos-slide'>{restaurants.map((restaurant) => {

                        return (<img src={`/images/${restaurant.logo}`} alt="Logo Here" key={restaurant._id} />);

                    })}</div><div className='logos-slide'>{restaurants.map((restaurant) => {

                        return (<img src={`/images/${restaurant.logo}`} alt="Logo Here" key={restaurant._id} />);

                    })}</div></>)}
                
            </div>
        </div>
    )
}


export default Clients;