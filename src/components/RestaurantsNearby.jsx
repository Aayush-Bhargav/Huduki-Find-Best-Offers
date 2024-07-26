import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import RestaurantContext from '../context/RestaurantContext';
import RestaurantInfoCard from './RestaurantInfoCard';
import { UilSearch } from '@iconscout/react-unicons';
import "../SearchBar.css"
import { UilLocationPoint } from '@iconscout/react-unicons';
import { colors } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import Spinner from './Spinner.jsx'
const libraries = ['places'];
const RestaurantsNearby = () => {
    const navigate = useNavigate();
    const { fetchRestaurantsAtReach, restaurantsAtReach, display, setRestaurant, handleRadius, searchRadius } = useContext(RestaurantContext);
    const [already, setAlready] = useState(false);
    const [loading, setLoading] = useState(false);
    const [details, setdetails] = useState({
        lat: 12.9716,
        lng: 77.5946, //coordinates are such that they represent center of bengaluru
        radius: 3, //default search radius is kept to be 3kms
        location: ''
    });
    const [text, setText] = useState('You are one step away from finding the best deals near you.');
    const autocompleteRef = useRef(null);
    const handleChange = (event) => { //function to handle any change in input etc
        const { name, value } = event.target;
        setdetails({ ...details, [name]: value });
        if (name === 'radius') {
            console.log(value);
            handleRadius(value);
            console.log(searchRadius);
        }
    };
    const handleClick = async () => {//to handle when the search icon gets clicked.
        setAlready(true);
        setLoading(true);//set loading to true
        await fetchRestaurantsAtReach(details.lat, details.lng, details.radius);

        console.log('Resta at reach', restaurantsAtReach);
        if (restaurantsAtReach.length > 0) { //means some match is definitely found
            setText(`Showing Restaurants within ${searchRadius} Km`);
        }
        else {
            setText('Sorry! No Restaurants found.')//no match found
        }
        setTimeout(()=>{
            setLoading(false);//once data has been fetched
        },200)
        
    }
    const onPlaceChanged = () => { //function to get the correct places recommended and set the coordinate details based on user choice
        try {
            const place = autocompleteRef.current.getPlace();
            if (!place.geometry) return;

            const { lat, lng } = place.geometry.location.toJSON();
            setdetails({
                ...details,
                lat: lat,
                lng: lng,
                location: place.formatted_address // Update location field with formatted address
            });
        }
        catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (restaurantsAtReach.length > 0) { //means some match is definitely found
            setText(`Showing Restaurants within ${searchRadius} Km`);
        }
        else if (already) {
            setText('Sorry! No Restaurants found.')//no match found
        }

    }, [restaurantsAtReach.length]);
    return (
        <>
            <div className='container' style={{ minHeight: "10vh" }}>
                <p className='poppins-semibold' style={{ textAlign: "center", fontSize: "30px", marginTop: "20px" }}>Find Best Offers Near You!</p>
                <Autocomplete onLoad={(autocomplete) => { autocompleteRef.current = autocomplete; }} onPlaceChanged={onPlaceChanged}>
                    <div >
                        <div className='searchBarContainer'>
                            <PlaceIcon></PlaceIcon>
                            <input
                                type='text'
                                name='location'
                                id='location'
                                aria-describedby='locationHelp'
                                onChange={handleChange}
                                value={details.location}
                                required
                                placeholder='Enter your location...' />
                            <UilSearch className='searchIcon' onClick={async () => {
                                await handleClick();
                            }} />
                        </div>
                        <div className='radiusSelector open-sans-light'>
                            <label htmlFor='radius'>Choose Radius:</label>
                            <select
                                name='radius'
                                id='radius'
                                onChange={handleChange}
                                onClick={(event) => {
                                    event.target.style.borderTop = 'none';
                                    event.target.style.boxShadow = 'none';

                                }}
                                value={searchRadius}
                                required
                            >
                                <option value={3}>3 Km</option>
                                <option value={5}>5 Km</option>
                                <option value={7}>7 Km</option>
                                <option value={10}>10 Km</option>
                                <option value={15}>15 Km</option>
                                <option value={1000}>None</option>
                            </select>
                        </div>
                    </div >
                </Autocomplete>
               
             
            </div >
            <div className='container my-3' style={{ minHeight: "10vh" }}>
                <p className='open-sans-bold' style={{ textAlign: "center", fontSize: "15px" }}>{text}</p>
                {loading ? <Spinner /> : <div className='row'>
                    {

                        restaurantsAtReach.length === 0 ? null : restaurantsAtReach.map((restaurant) => {
                            return <RestaurantInfoCard key={restaurant._id} restaurant={restaurant} ></RestaurantInfoCard>
                        })
                    }
                </div>}

            </div>

        </>
    )
}
export default RestaurantsNearby;

