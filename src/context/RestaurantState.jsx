import React, { useState, useEffect } from "react";
import RestaurantContext from "./RestaurantContext";
import axios from "axios";
const RestaurantState = (props) => {
    const host = "http://localhost:5000"; //server host address
    const [count, setCount] = useState(0);
    const [restaurants, setRestaurants] = useState([]); //used to store all restaurants registered to Huduki
    const [everyRestaurant, setEveryRestaurant] = useState([]);//this holds every single restaurant irrespective of whether their membership is active or not
    const [images, setImages] = useState([]); //used to store all offer images uploaded by each registered restaurant
    const [logos, setLogos] = useState([]);//used to store logos of all restaurants
    const [restaurantsAtReach, setRestaurantsAtReach] = useState([]); //used to store the restaurants within a particular radius of a particualr center
    const [loggedIn, setLoggedIn] = useState(false);//to maintain the state of whether user is logged in or not
    const [restaurant, setRestaurant] = useState(() => { //used to set the restaurant in focus
        const savedRestaurant = localStorage.getItem('restaurant'); //checks if it is already in the local storage
        return savedRestaurant ? JSON.parse(savedRestaurant) : null;
    });
    const [searchRadius, setRadius] = useState(3);
    const handleRadius = async (radius) => {//to set the search radius
        setRadius(radius);
    }
    const handleLogin = (val) => {
        setLoggedIn(val);//set logged in value to this
    }
    const [progress, setProgress] = useState(0);//set progress bar state to 0 initially
    const startLoading = () => setProgress(0);//to mark start of loading
    const finishLoading = () => setProgress(100);//to mark end of loading
    const [display, setDisplay] = useState(true);
    const [alert, setAlert] = useState({
        msg: "",
        color: ''
    });
    const setTheRestaurant = async (id) => {//for setting the restaurant when some user clicks on a restaurant info card so we can display details of offers etc.
        try {
            restaurantsAtReach.forEach((restaurant) => {//iterate through all the restaurants at reach and set the restaurant to the one whose id matches the input id
                console.log(typeof (restaurant._id));
                if (restaurant._id === id) {

                    setRestaurant(restaurant);
                    localStorage.setItem('restaurant', JSON.stringify(restaurant));

                }
            })
        }
        catch (error) {
            console.log(error, "Occured in function 'setTheRestaurant'");
        }

    }
    const fetchRestaurants = async () => {//function to fetch all restaurants using our backend api
        try {
            setCount(1);
            const response = await axios.get(`${host}/api/restaurant/all-restaurants`);//endpoint to fetch all registered restaurant
            console.log("response:" + response.status);//just to view response status
            const arr = response.data.restaurants; //construct the array

            console.log('fetch restaurants', arr); //just to see what the api returns us
            setRestaurants(arr); //setting restaurants to what the api returns us
            console.log('length:', restaurants.length);

            const response1 = await axios.get(`${host}/api/restaurant/all-restaurant-images`);//endpoint to fetch all restaurant images
            console.log("response:" + response1.status);//just to view response status
            const arr1 = response1.data.images; //construct the array
            console.log(arr1); //just to see what the api returns us
            setImages(arr1); //setting images to what the api returns us
            const response2 = await axios.get(`${host}/api/restaurant/all-restaurant-logos`);//endpoint to fetch all restaurant logos
            console.log("response:" + response2.status);//just to view response status
            const arr2 = response2.data.logos; //construct the array
            console.log(arr2); //just to see what the api returns us
            setLogos(arr2); //setting images to what the api returns us
            const response3 = await axios.get(`${host}/api/restaurant/every-single-restaurant`);//endpoint to fetch every single restaurant
            setEveryRestaurant(response3.data.restaurants);//construct the array
          

        } catch (error) {//means some error occured.
            console.error('Error posting data:', error);
        }
    }
    useEffect(() => { //used to run right after it renders to fetch list of all the restaurants registered
        const func = async () => {
            await fetchRestaurants();
        }
        func();
    }, [restaurants.length]);

    useEffect(() => { //used to run whenever restaurantsAtReach changes
        console.log('Updated restaurantsAtReach:', restaurantsAtReach);
    }, [restaurantsAtReach]);
    const [showAlert, setShowAlert] = useState(false);
    const displayAlert = (msg, color) => {//function to display a dismissing alert that disappears after 1.5s
        setShowAlert(true);
        setAlert({
            msg: msg,
            color: color
        });
        setTimeout(() => {
            setShowAlert(false);
            setAlert({ msg: "", color: "" });
        }, 1500)
    }
    const handleDisplay = () => {
        setDisplay(!display);
    }
    const handleProgress = (progress) => {
        setProgress(progress);//set progress of loading bar to a specific value
    }
    const setRestaurantForLogin = async (id) => {//for setting the restaurant when someone logs in so we can display their information
        try {
            everyRestaurant.forEach((restaurant) => {//iterate through all the restaurants in the database and set the restaurant to the one whose id matches the input id
                console.log(typeof (restaurant._id));
                if (restaurant._id === id) {
                    setRestaurant(restaurant);
                
                    localStorage.setItem('restaurant', JSON.stringify(restaurant));
                    setTimeout(() => { }, 10);
                }
            });

        } catch (err) {
            console.error('Error occured in setrestaurantForLogin', err);
        }
    }

    async function fetchRestaurantImages() {//function to fetch all restaurants and hence the images of offers they have uploaded) using our backend api
        try {
            const response = await axios.get(`${host}/api/restaurant/all-restaurant-images`);//endpoint to fetch all restaurant images
            console.log("response:" + response.status);//just to view response status
            const arr = response.data.images; //construct the array
            console.log(arr); //just to see what the api returns us
            setImages(arr); //setting images to what the api returns us

        } catch (error) {//means some error occured.
            console.error('Error posting data:', error);
        }
    }
    async function fetchRestaurantLogos() {//function to fetch all restaurant logos 
        try {
            const response = await axios.get(`${host}/api/restaurant/all-restaurant-logos`);//endpoint to fetch all restaurant logos
            console.log("response:" + response.status);//just to view response status
            const arr = response.data.logos; //construct the array
            console.log(arr); //just to see what the api returns us
            setLogos(arr); //setting logos to what the api returns us

        } catch (error) {//means some error occured.
            console.error('Error posting data:', error);
        }
    }
    async function fetchRestaurantsAtReach(lat, lng, radius) {//function to fetch all restaurants within a certain radius
        try {
            setProgress(10);
            const response = await axios.get(`${host}/api/restaurant/find-restaurants?lng=${lng}&lat=${lat}&radius=${radius}`);//endpoint to fetch details of all restaurants that are within a certain radius from given coordinates
            console.log("response:" + response.status);//just to view response status
            const arr = response.data.restaurants; //construct the array
            console.log(arr); //just to see what the api returns us
            setRestaurantsAtReach(arr); //setting restaurants to what the api returns us
            setProgress(100);
            console.log('in backend', restaurantsAtReach)
        } catch (error) {//means some error occured.
            console.error('Error posting data:', error);
        }
    }
    //funtion to Add a Restaurant
    const addRestaurant = async (restaurant) => {//get the new restaurant to add as a parameter
        const newRestaurants = [...restaurants];
        newRestaurants.push(restaurant);
        setRestaurants(newRestaurants);
    }
    async function deleteRestaurantFromDatabase(id) {//function to add a Restaurant USING our backend api
        try {
            const response = await axios.delete(`${host}/api/Restaurants/delete-restaurant/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    "auth-token": localStorage.getItem('token')
                }
            });
            let arr = response.data;
            console.log("add Restaurant" + arr);
        } catch (error) {
            console.error('Error posting data:', error);
        }
    }

    //function to Delete a Restaurant
    const deleteRestaurant = async (id) => {
        let newRestaurants = restaurants.filter((Restaurant) => {
            return Restaurant._id !== id;
        });
        await deleteRestaurantFromDatabase(id);
        setRestaurants(newRestaurants);
    }
    async function editRestaurantInDatabase(image1, image2, id, alternateContactPerson, alternatePhone, alternateEmail, image2Removed) {//function to edit a Restaurant in the database USING our backend api
        try {
            const response = await axios.put(`${host}/api/restaurant/update-restaurant/${id}`, { image1, image2, id, alternateContactPerson, alternatePhone, alternateEmail, image2Removed }, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "auth-token": localStorage.getItem('token')
                }
            });

            console.log(response.data);
            return response.data.restaurant; //this contains the updated restaurant information. Return it
        } catch (error) {
            displayAlert('Editing Details Failed! Try again.', 'danger');
            console.error('Error posting data:', error);
        }
    }
    //function to Edit a Restaurant
    const editRestaurant = async (image1, image2, id, alternateContactPerson, alternatePhone, alternateEmail, image2Removed) => {

        try {
            console.log('Image 1:', image1);
            console.log('Image 2:', image2);
            const updatedRestaurant = await editRestaurantInDatabase(image1, image2, id, alternateContactPerson, alternatePhone, alternateEmail, image2Removed);//collect updated restaurant information and display it
            console.log('here in restaurant state');
            restaurants.forEach((restaurant) => { //iterate through all the Restaurants
                if (restaurant._id === id) {//find the Restaurant that matches and update its contents
                    restaurant.image1 = updatedRestaurant.image1;
                    restaurant.image2 = updatedRestaurant.image2;
                    restaurant.altContactPerson = updatedRestaurant.altContactPerson;
                    restaurant.altPhone = updatedRestaurant.altPhone;
                    restaurant.altEmail = updatedRestaurant.altEmail;
                }
            });
            setRestaurant(updatedRestaurant);//make the updated restaurant the one to display
            localStorage.setItem('restaurant', JSON.stringify(updatedRestaurant));//store the updated restaurant to our local storage
            setRestaurants(restaurants);//update the restaurants array
            await fetchRestaurantImages();
            await fetchRestaurantLogos();
            await fetchRestaurants();
            displayAlert('Successfully edited the details!', 'success');
        }
        catch (error) {
            console.log(error);
        }

    }
    return (
        <RestaurantContext.Provider value={{ restaurants: restaurants, restaurantsAtReach: restaurantsAtReach, fetchRestaurantImages, setRestaurants, fetchRestaurantsAtReach, fetchRestaurantLogos, addRestaurant, deleteRestaurant, editRestaurant, setTheRestaurant, restaurant: restaurant, handleDisplay, display: display, alert, showAlert, displayAlert, setRestaurantForLogin, images: images, logos, fetchRestaurantLogos, progress, handleProgress, startLoading, finishLoading, handleRadius, searchRadius, handleLogin, fetchRestaurants }}>
            {props.children}
        </RestaurantContext.Provider>
    )
}

export default RestaurantState;