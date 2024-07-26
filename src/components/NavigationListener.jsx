// NavigationListener.jsx
import React, { useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RestaurantContext from '../context/RestaurantContext';

const NavigationListener = () => {//manages the loading bar state when the user navigates between different routes
    const location = useLocation(); //gives current location object
    const navigate = useNavigate(); //provides a function to navigate programatically
    const { startLoading, finishLoading, handleProgress } = useContext(RestaurantContext);


    useEffect(() => {
        startLoading();//start loading whenever location object changes
        let timer = setTimeout(() => {
            handleProgress(30);
        }, 20); // Simulate a loading duration
        timer = setTimeout(() => {
            handleProgress(60);
        }, 50); // Simulate a loading duration
        timer = setTimeout(() => {
            finishLoading();
        }, 60); // Simulate a loading duration
      

        return () => clearTimeout(timer);
    }, [location]);

    return null;


};

export default NavigationListener;
