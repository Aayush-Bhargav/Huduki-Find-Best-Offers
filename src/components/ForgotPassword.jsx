import React, { useCallback, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UilEnvelope } from '@iconscout/react-unicons'
import { NavLink } from 'react-router-dom';
import '../App.css'
import RestaurantContext from '../context/RestaurantContext';

const ForgotPassword = () => {
    // Set default headers for Axios to send JSON content
    // const { displayAlert } = useContext(noteContext);
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    let navigate = useNavigate();
    const host = "http://localhost:5000";
    const [show, setShow] = useState(false);
    const [verifyOTP, setVerifyOTP] = useState('');
    const { displayAlert } = useContext(RestaurantContext);
    const [credentials, setCredentials] = useState({ email: "", otp: "" });
    async function resetPassword(email, otp) {//function to reset password using email
        let response;
        console.log('hi');
        try {//hit the endpoint responsible for reset of password
            displayAlert('Just a moment. Verifying Details...', 'success');
            response = await axios.post(`${host}/api/auth/forgot-password`, { email, otp }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            displayAlert('Password Successfully Reset!', 'success');
            console.log(response);
            navigate("/login");


        } catch (error) {
            displayAlert(`Invalid OTP! Password Couldn't get reset.`, 'danger');
            console.log('Error posting data:', error.response);
            // displayAlert('Invalid Credentials. Try Again', 'danger');
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();//prevent default form submission behaviour
        await resetPassword(credentials.email, credentials.otp);//call reset function password

    }
    const handleChange = (event) => { //function to handle input change
        const { name, value } = event.target;
        console.log('name:', name, 'value:', value);
        setCredentials((credentials) => {
            return { ...credentials, [name]: value };
        });
    }
    return (
        <div className='anotherContainer'>
            <div className='login-container '>
                <div className='forms'>
                    <div className='form login'>
                        <span className='poppins-semibold title '>Reset Password</span>

                        <form onSubmit={handleSubmit} col-sm-12 col-8>
                            <div className="input-field" style={{ marginBottom: "30px" }}>
                                <input type="email" name="email" placeholder="Enter your email" id="email" aria-describedby="emailHelp" onChange={handleChange} value={credentials.email} required minLength={5} /><UilEnvelope className="icon" />
                            </div>

                            {show && <div className="input-field" style={{ marginBottom: "30px" }} >
                                <input type='text' name="otp" placeholder="Enter the otp sent to your email" id="otp" onChange={handleChange} value={credentials.otp} required /><UilEnvelope className="icon" />
                            </div>}
                            {!show && <div className='input-field button'>
                                <input type="button" value="Reset Password" onClick={async () => {

                                    try {//hit the endpoint responsible for reset of password
                                        displayAlert('Just a moment. Verifying Email...', 'success');
                                        let response = await axios.post(`${host}/api/auth/send-otp`, { email: credentials.email }, {
                                            headers: {
                                                'Content-Type': 'application/json',
                                            }
                                        });
                                        setShow(!show);
                                        displayAlert('An OTP has been sent to your email!', 'success');
                                        console.log(response);

                                    } catch (error) {
                                        displayAlert('Invalid Email!', 'danger');
                                        console.error('Error posting data:', error.response);
                                        // displayAlert('Invalid Credentials. Try Again', 'danger');
                                    }

                                }} />
                            </div>}
                            {show && <div className='input-field button'>
                                <input type="submit" value="Reset Password" />
                            </div>}
                        </form>
                        <div className='login-signup'>
                            <span className='text'>Not a member?<NavLink to="/signup" className='text signup-text'> Sign Up Now</NavLink>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ForgotPassword;