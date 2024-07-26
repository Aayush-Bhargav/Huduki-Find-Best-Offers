import { Password } from '@mui/icons-material';
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import RestaurantContext from '../context/RestaurantContext'
import { UilEnvelope } from '@iconscout/react-unicons'
import { UilLock } from '@iconscout/react-unicons'
import { UilEyeSlash } from '@iconscout/react-unicons'
import { UilEye } from '@iconscout/react-unicons'
import { NavLink } from 'react-router-dom';
import DiscountIcon from '@mui/icons-material/Discount';
import Spinner from './Spinner';
import '../App.css'

const VerifyCoupon = () => {
    // Set default headers for Axios to send JSON content
    // const { displayAlert } = useContext(noteContext);
    const { displayAlert, restaurant } = useContext(RestaurantContext);
    const [disabled, setDisabled] = useState(false);//to disable the button once it has been clicked until a response arrives
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    const { setRestaurantForLogin } = useContext(RestaurantContext);
    let navigate = useNavigate();
    const host = "http://localhost:5000";
    const [code, setCode] = useState('');//hold the coupon code
    useEffect(() => { //to access this page, it is essential that the user is logged in.
        const check = async () => {

            const now = new Date().getTime();

            try {
                if (localStorage.getItem('token') && localStorage.getItem('tokenExpiration') && (localStorage.getItem('tokenExpiration') >= now)) { //if this is there , do not do anything
                }
                else {
                    console.log('In else block now.')
                    localStorage.removeItem('token');
                    localStorage.removeItem('tokenExpiration');
                    displayAlert('Session Expired. Please Login to Continue', 'success',2000);
                    navigate("/login"); //redirect user to login if there is no token in the local storage
                }
            } catch (error) {
                localStorage.removeItem('token');
                localStorage.removeItem('tokenExpiration');
                console.error('Error fetching restaurant details');
            }

        };
        //initial check
        check();
        // Set up interval to check every half minute (30000 milliseconds)
        const intervalId = setInterval(check, 30000);

        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    async function VerifyCoupon(code) {//function to add a note USING our backend api
        let response;

        try {
            //must be logged in to perform this activity
            response = await axios.post(`${host}/api/restaurant/verify-coupon`, { couponCode: code, id: restaurant._id, email: restaurant.email }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log('Verify Token Response:', response);
            if (response.data.success) {
                setTimeout(() => {
                    displayAlert(`Coupon has been redeemed successfully! Email: ${response.data.coupon.email} and Name: ${response.data.coupon.name}`, 'success',5000);
                }, 1000)
            }
        } catch (error) {
            setTimeout(() => {
                displayAlert(`${error.response.data.error}`, 'warning',3000);
            }, 1000)

        }
        finally {
            setTimeout(()=>{
                setDisabled(false);//enable the button again
            },1000)
           
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setDisabled(true);//disable the button
        displayAlert('Verifying Coupon.. Just a moment', 'success',2000);
        await VerifyCoupon(code);
        setCode('');

    }
    const handleChange = (event) => {
        const { value } = event.target;
        setCode(value);
    }
    return (
        <div className='anotherContainer'>
            {disabled && <Spinner />}
            <div className='login-container '>
                <div className='forms'>
                    <div className='form login'>
                        <span className='poppins-semibold title '>Verify Coupon</span>

                        <form onSubmit={handleSubmit} col-sm-12 col-8>
                            <div className="input-field">
                                <input type="text" name="code" placeholder="Enter the coupon code" id="code" onChange={handleChange} value={code} required minLength={5} maxLength={5} /><DiscountIcon className="icon" />
                            </div>
                            <div className='input-field button' style={{ marginTop: "30px" }}>
                                <input type="submit" value="Verify" disabled={disabled} />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default VerifyCoupon;







