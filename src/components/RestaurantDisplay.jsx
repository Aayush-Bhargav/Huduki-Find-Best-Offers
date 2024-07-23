import React, { useState, useContext, useEffect } from 'react';
import RestaurantContext from '../context/RestaurantContext';
import MapComponent from './MapComponent';
import { UilPhone } from '@iconscout/react-unicons';
import { UilLocationPoint } from '@iconscout/react-unicons';
import PlaceIcon from '@mui/icons-material/Place';
import PhoneIcon from '@mui/icons-material/Phone';
import { useNavigate } from 'react-router-dom';
import { UilUser } from '@iconscout/react-unicons';
import EmailIcon from '@mui/icons-material/Email';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios';
const host = 'http://localhost:5000';
const RestaurantDisplay = () => {
    const { restaurant, images, restaurants, setTheRestaurant, progress } = useContext(RestaurantContext);//extract the restaurant from the context; Now there is access to all the details of the restaurant
    const [disabled, setDisabled] = useState(false);//this is to disable the 'generate coupon' button once it has been clicked until a response comes
    useEffect(() => {
        console.log('in use effect!')
        setTheRestaurant(restaurant._id);
    }, [restaurants]);
    const [details, setDetails] = useState({ name: '', email: '' });
    const handleChange = (event) => {//function to handle input change
        const { name, value } = event.target;
        setDetails({ ...details, [name]: value });

    }
    const handleSubmit = async (e) => {//function to handle form submission to generate a code
        e.preventDefault();//prevent the default form submission behaviour
        setDisabled(true);
        try {
            const response = await axios.post(`${host}/api/restaurant/generate-coupon`, {
                email: details.email,
                name: details.name,
                restaurantId: restaurant._id
            },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            if (response.data.success) {
                alert(`Coupon code successfully generated and sent to ${details.email}!`);
            } else {
                alert('Failed to generate coupon code');
            }
        } catch (error) {
            console.error('Error generating coupon:', error);
            alert('An error occurred while generating the coupon');
        }
        finally {
            setDisabled(false);
        }

    }
    console.log('in display:', restaurant)
    return (
        <>
            <div className="container col-xxl-8 px-4 py-lg-4">
                <div className="row flex-lg-row-reverse align-items-center g-5 pt-5 pb-3">
                    <div className="col-10 col-sm-8 col-lg-6">
                        <img src={`/images/${restaurant.logo}`} className="d-block  mx-lg-auto img-fluid" alt="Restaurant Logo" height="500" loading="lazy" />
                    </div>
                    <div className="col-lg-6">
                        <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">{restaurant.restaurantName}</h1>
                        <p className="lead"><PlaceIcon className="restaurant-display-icon"></PlaceIcon>{restaurant.address}</p>
                        <p className="lead"><PhoneIcon className="restaurant-display-icon"></PhoneIcon>{restaurant.contactPhone}</p>
                        {/* <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                        <button type="button" className="btn btn-primary btn-lg px-4 me-md-2">Primary</button>
                        <button type="button" className="btn btn-outline-secondary btn-lg px-4">Default</button>
                    </div> */}
                    </div>
                </div>
            </div>
            <div className='container col-xxl-8 px-4 my-md-3 py-lg-3'>
                <div className='row'>
                    <h4 className='text-body-emphasis fw-bold'>Current Offers</h4>
                </div>

                <div className='row'>
                    <div className='col-lg-6 col-sm-10 my-4' style={{ display: "flex" }}>
                        <img src={`/images/${restaurant.image1}`} className='d-block my-auto mx-lg-auto displayOffer' alt="Offer 1 pic" ></img>
                    </div>
                    {restaurant.image2 ? <div className='col-lg-6 col-sm-10 my-4' style={{ display: "flex" }} >
                        <img src={`/images/${restaurant.image2}`} className='d-block mx-lg-auto my-auto displayOffer' alt="Offer 2 pic" ></img>
                    </div> : <div className='col-lg-6 col-sm-10 my-4'></div>}
                </div>
            </div>
            <div className='container col-xxl-8 px-4 my-md-3 py-lg-3'>
                <div className='row'>
                    <h4 className='text-body-emphasis fw-bold'>Directions</h4>
                </div>
                <div className='row'>
                    <div className='col-lg-10  my-4' >
                        <MapComponent location={restaurant.location} />
                    </div>
                </div>
            </div>
            <div className='container col-xxl-8 px-4 my-md-3 py-lg-3'>
                <div className='row my-3'>
                    <h4 className='text-body-emphasis fw-bold'>Avail Exciting Offers!</h4>
                </div>
                <div className='row mt-3'>
                    <p className='text-body-emphasis '>Show the Coupon at <b>{restaurant.restaurantName}</b> and avail additional exciting offers!</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className='row '>
                        <div className='my-2 col-md-6 col-sm-12'>
                            <div className='input-field'>
                                <input id="email" name="email" type="email" placeholder='Enter your email address' required value={details.email} onChange={handleChange} aria-describedby='emailHelp'></input>
                                <EmailIcon className='icon' />
                            </div>
                        </div>
                        <div className='my-2 col-md-6 col-sm-12'>
                            <div className='input-field'><input id="name" name="name" type="text" placeholder='Enter your name' required minLength={3} value={details.name} onChange={handleChange}></input>
                                <AccountCircleIcon className='icon' />
                            </div>
                        </div>

                    </div>
                    <button disabled={disabled} type="submit" className="btn mt-3 mb-4 coupon"  >Generate Coupon</button>
                </form>
            </div>
        </>
    )
}
export default RestaurantDisplay;
