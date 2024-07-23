import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import RestaurantContext from '../context/RestaurantContext';

const RestaurantInfoCard = (props) => {
    const navigate = useNavigate();
    const { setTheRestaurant, restaurant } = useContext(RestaurantContext);
    return (
        <div className='col-lg-4 col-md-6 col-sm-12 my-2'>
            <div className="card"  onClick={async () => {
                await setTheRestaurant(props.restaurant._id);
                console.log('props:', props.restaurant);
                navigate("/restaurant-display");
            }}>
                <img src={`/images/${props.restaurant.image1}`} alt="Restaurant Offer Photograph Here" className="card-img-top" style={{ "padding": "8px", "paddingBottom": "0px" }} />
                <div className="card-body" style={{ "padding": "8px", "paddingTop": "0px" }}>
                    <div className='card-text open-sans-semibold' style={{ marginBottom: "10px" ,fontSize:"20px"}}>
                        <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                            <b>{props.restaurant.restaurantName}</b>
                            <span style={{ color: 'green', fontFamily: "" }}>{(props.restaurant.distance / 1000) == 0 ? `${props.restaurant.distance.toFixed(2)} m` : `${(props.restaurant.distance / 1000).toFixed(2)} Km`}</span>
                        </div>
                    </div>
                    <p className="card-text open-sans-less-bold">{props.restaurant.address}</p>
                </div>
            </div>
        </div>
    )
}
export default RestaurantInfoCard;
