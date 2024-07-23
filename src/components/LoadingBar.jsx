// LoadingBarComponent.jsx
import React, { useContext } from 'react';
import LoadingBar from 'react-top-loading-bar';
import RestaurantContext from '../context/RestaurantContext';

const LoadingBarComponent = () => {
    const { progress } = useContext(RestaurantContext);
    return (
        <LoadingBar
            height={1.8}
            color='purple'
            progress={progress}
        />
    );
};

export default LoadingBarComponent;
