import { Password } from '@mui/icons-material';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import RestaurantContext from '../context/RestaurantContext'
import { UilEnvelope } from '@iconscout/react-unicons'
import { UilLock } from '@iconscout/react-unicons'
import { UilEyeSlash } from '@iconscout/react-unicons'
import { UilEye } from '@iconscout/react-unicons'
import { NavLink } from 'react-router-dom';
import '../App.css'

const Login = () => {
    // Set default headers for Axios to send JSON content
    // const { displayAlert } = useContext(noteContext);
    const { displayAlert, restaurant } = useContext(RestaurantContext);

    axios.defaults.headers.common['Content-Type'] = 'application/json';
    const { setRestaurantForLogin } = useContext(RestaurantContext);
    let navigate = useNavigate();
    const host = "http://localhost:5000";
    const [show, setShow] = useState(false);

    const [credentials, setCredentials] = useState({ email: "", password: "" });
    async function loginUser(email, password) {//function to add a note USING our backend api
        let response;
        console.log('hi');
        try {
            response = await axios.post(`${host}/api/auth/login-restaurant`, { email, password }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log('Login Response', response);
            const id = response.data.id;//get the restaurant id

            await setRestaurantForLogin(id);
            // if it is still here, it means login success

            displayAlert('Login Successful!', 'success');
            const now = new Date();
            const expirationTime = now.getTime() + 20 * 60 * 1000; // convert minutes to milliseconds(20 minutes validity time for the token)
            // save the authtoken and redirect
            localStorage.setItem('token', response.data.authtoken);
            localStorage.setItem('tokenExpiration', expirationTime);
            setTimeout(() => { }, 10);//wait for 10 milliseconds
            if (response.data.isActive)//if membership is active, then navigate to edit page
            {
                navigate("/view-edit-details");
            }
            else { //else navigate to the page to renew membership
                console.log('in login:',restaurant);
                navigate("/renew-membership");
            }

        } catch (error) { //means some error occured
            console.error('Error posting data:', error.response);
            displayAlert('Invalid Credentials. Try Again', 'danger');
        }
    }
    const toggleShow = () => {//for showing or hiding the password
        setShow(!show);
    }
    const handleSubmit = async (e) => {//handling form submission
        e.preventDefault();
        await loginUser(credentials.email, credentials.password);

    }
    const handleChange = (event) => {//handling input changes
        const { name, value } = event.target;
        setCredentials((credentials) => {
            return { ...credentials, [name]: value };
        });
    }

    return (
        <div className='anotherContainer'>
            <div className='login-container '>
                <div className='forms'>
                    <div className='form login'>
                        <span className='poppins-semibold title '>Login To Huduki</span>

                        <form onSubmit={handleSubmit} col-sm-12 col-8>
                            <div className="input-field">
                                <input type="email" name="email" placeholder="Enter your email" id="email" aria-describedby="emailHelp" onChange={handleChange} value={credentials.email} required minLength={5} /><UilEnvelope className="icon" />
                            </div>
                            <div className="input-field">
                                <input type={show ? "text" : "password"} name="password" placeholder="Enter your password" id="password" onChange={handleChange} value={credentials.password} required minLength={8} /><UilLock className="icon" />
                                {!show && <UilEyeSlash className='eye' onClick={() => {
                                    toggleShow();
                                }} />}
                                {show && <UilEye className='eye' onClick={() => {
                                    toggleShow();
                                }} />}
                            </div>
                            <div className='forgotPassword'>
                                <NavLink to='/forgot-password' className='text'>Forgot Password?</NavLink>
                            </div>
                            <div className='input-field button'>
                                <input type="submit" value="Login" />
                            </div>
                        </form>
                        <div className='login-signup'>
                            <span className='text'>New to Huduki?<NavLink to="/signup" className='text signup-text'> Sign Up Now</NavLink>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Login;