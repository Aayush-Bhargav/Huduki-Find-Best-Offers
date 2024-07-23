import React, { useState, useRef, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import RestaurantContext from '../context/RestaurantContext';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import { UilRestaurant } from '@iconscout/react-unicons';
import { UilDialpadAlt } from '@iconscout/react-unicons';
import { UilUser } from '@iconscout/react-unicons';
import { UilLocationPoint } from '@iconscout/react-unicons';
import { UilEnvelope } from '@iconscout/react-unicons';
import { UilUserPlus } from '@iconscout/react-unicons';
import { UilEnvelopeAdd } from '@iconscout/react-unicons';
import { UilPhone } from '@iconscout/react-unicons';
import { UilPhoneAlt } from '@iconscout/react-unicons';
import { UilClock } from '@iconscout/react-unicons';
import { UilImage } from '@iconscout/react-unicons';
import { UilImagePlus } from '@iconscout/react-unicons';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import CancelIcon from '@mui/icons-material/Cancel';
import { Navigate, useNavigate } from 'react-router-dom';
import '../App.css'


const host = 'http://localhost:5000';
// Define libraries as a constant outside of the component
const libraries = ['places'];

const RenewForm = () => {
    console.log('hey in renew form');
    const { restaurant, displayAlert, fetchRestaurants } = useContext(RestaurantContext);//set the restaurant
    const [disabled, setDisabled] = useState(false); //to disable the register button once it is clicked until a response is received
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
                    displayAlert('Session Expired', 'success');
                    navigate("/login"); //redirect user to login if there is no token in the local storage
                }
            } catch (error) {
                localStorage.removeItem('token');
                localStorage.removeItem('tokenExpiration');
                navigate("/login");
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


    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // State to track loading status
    axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';


    const [amount, setAmount] = useState(1);//as default registration duration is 6 months
    const [credentials, setCredentials] = useState({
        id: restaurant._id,
        restaurantName: restaurant.restaurantName,
        email: restaurant.email,
        contactPhone: restaurant.contactPhone,
        contactPerson: restaurant.contactPerson,
        altContactPerson: restaurant.altContactPerson,
        altContactPhone: restaurant.altPhone,
        gstNumber: restaurant.gstNumber,
        altEmail: restaurant.altEmail,
        registrationDuration: restaurant.registrationDuration,
        lat: restaurant.location.coordinates[1],
        lng: restaurant.location.coordinates[0],
        location: restaurant.address,// Add location field to state
        address: restaurant.address
    });
    useEffect(() => {
        setAmount(credentials.registrationDuration === '6 months' ? 1 : 2);
    }, [credentials.registrationDuration]);
    const [editing, setEditing] = useState(false);//initially form is just in display mode; Once user clicks the edit button we enable editing.
    const [image1, setImage1] = useState(`/images/${restaurant.image1}`);//this is used for preview
    const src2 = restaurant.image2 ? `/images/${restaurant.image2}` : null;
    const [image2, setImage2] = useState(src2);
    const [updatedImage1, setUpdatedImage1] = useState(null);//this is used for upload when user clicks the done button
    const [updatedImage2, setUpdatedImage2] = useState(null);
    const [image1Name, setImage1Name] = useState(`/images/${restaurant.image1}`);
    const [image2Name, setImage2Name] = useState(src2);

    const autocompleteRef = useRef(null);
    const renewMembership = async (formData, razorpay_order_id, razorpay_payment_id, razorpay_signature, amount) => {//call api to create restaurant with given details
        try {
            console.log('In renew Membership ')
            let response1 = await axios.post(`${host}/api/restaurant/renew-membership`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('response from renew membership:', response1);
            let resp = await axios.post(`${host}/api/payment/payment-details`, { //call the api responsible for saving payment details
                amount: amount,
                restaurantId: response1.data.restaurant._id,
                razorpay_order_id: razorpay_order_id,
                razorpay_payment_id: razorpay_payment_id,
                razorpay_signature: razorpay_signature,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response1.data.success;
        } catch (error) {
            console.error('Error posting data:', error.response);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();//prevent default form submission action
        setDisabled(true);
        try {
            // Generate a unique identifier for each payment 
            console.log('Hi');
            const uuid = uuidv4().replace(/-/g, ''); // Remove dashes from UUID
            const shortUuid = uuid.substring(0, 12); // Take the first 12 characters
            const timestamp = Date.now(); // Get current timestamp
            const uniqueReceipt = `receipt#${shortUuid}${timestamp}`; // Combine short UUID with timestamp
            //make a post request to the given url to place a payment order on Razorpay
            const response = await axios.post(`${host}/api/payment/orders`, {
                amount: amount,
                currency: 'INR',
                receipt: uniqueReceipt
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(response.data);
            const order = response.data;
            console.log('Order:', order)
            //response.data will be an object containing various attributes most important being the order id stored as 'id'

            let options = {
                "key_id": 'rzp_test_pKvciih6vFVt2w', //api key for payment
                "amount": order.amount, //amount in rupees
                "currency": order.currency,//currency is INR
                "name": "Huduki Pvt Ltd.", //business name
                "description": "Membership Renewal Payment",
                "image": "https://example.com/your_logo",
                "order_id": order.id, //This is the `id` obtained in the response of previous post request
                "handler": async function (response) { //this function runs on successful verification

                    // // Verify payment
                    try {
                        displayAlert('Please Wait a moment. Verifying Details!', 'warning');
                        //get the verification response from the backend
                        const verificationResponse = await axios.post(`${host}/api/payment/verify`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        }, {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                        if (verificationResponse.data.success) {//if payment is successful
                            alert('Payment verified successfully! Welcome aboard Huduki!!');//alert this message
                            //and create user with said credentials 
                            const formData = new FormData();
                            Object.keys(credentials).forEach((key) => formData.append(key, credentials[key]));
                            if (image1) formData.append('image1', image1);
                            if (image2) formData.append('image2', image2);
                            formData.append('amount', order.amount);//add amount also to the form data 
                            const result = await renewMembership(formData, response.razorpay_order_id, response.razorpay_payment_id, response.razorpay_signature, order.amount);
                            console.log('hi');
                            console.log('result', result);
                            // if it is still here, it means register success
                            if (result) {
                                displayAlert('Successfully Renewed Huduki Membership!', 'success');
                                navigate('/view-edit-details');
                            }
                            else
                                displayAlert('Could not renew membership! Try again.', 'danger');

                            await fetchRestaurants();
                        } else {//if payment is unsuccessful
                            displayAlert('Payment verification failed! Try again.', 'danger');

                        }

                    } catch (error) {
                        displayAlert('Payment verification failed! Try again.', 'danger');
                        console.error('Error verifying payment:', error);
                    }
                },
                "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
                    "name": credentials.restaurantName, //Name of the restaurant
                    "email": credentials.email,
                    "contact": credentials.contactPhone  //Provide the customer's phone number for better conversion rates 
                },
                "notes": {
                    "address": "Razorpay Corporate Office"
                },
                "theme": {
                    "color": "#3399cc"
                }
            };

            let rzp1 = new window.Razorpay(options);
            rzp1.open();
            rzp1.on('payment.failed', function (response) {//on payment failure handle it like this by showing alerts
                alert(response.error.description);
                alert(response.error.reason);

            });


        }
        catch (err) {
            displayAlert('Form submission failed! Try again.', 'danger');
            console.error("Error occured in submit function", err);//print this to the console
        }
        finally{
            setDisabled(false);//enable the renew button again
        }

    };

    const handleFileChange = (event) => {
        const { name, files } = event.target;
        if (name === 'image1') {
            setImage1(URL.createObjectURL(files[0]));//creates a temporary url representing the selected file
            setUpdatedImage1(files[0]);
            setImage1Name(files[0].name)
        }
        else if (name === 'image2') {
            setImage2(URL.createObjectURL(files[0]));//creates a temporary url representing the selected file
            setUpdatedImage2(files[0]);
            setImage2Name(files[0].name)
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const onPlaceChanged = () => {
        const place = autocompleteRef.current.getPlace();
        if (!place.geometry) return;

        const { lat, lng } = place.geometry.location.toJSON();
        setCredentials({
            ...credentials,
            lat: lat,
            lng: lng,
            location: place.formatted_address, // Update location field with formatted address
            address: place.formatted_address // Update location field with formatted address
        });
    };

    return (
        <>
            <div className='anotherContainer'>
                <div className='reg-container' style={{ marginTop: "5rem", marginBottom: "5rem" }}>
                    <div className='form'>
                        <p className='poppins-semibold  ' style={{ textAlign: "center" }}>Welcome {restaurant.restaurantName}! </p>
                        <p className='poppins-less-bold' style={{ textAlign: "center", marginTop: "30px", fontSize: "20px" }}>Renew your Membership with Huduki!</p>
                        <form onSubmit={handleSubmit} encType='multipart/form-data'>
                            <div className='row'>
                                <div className='my-3 col-lg-6 col-md-12'>
                                    <div className='input-field'>
                                        <input
                                            disabled={true}
                                            type='text'
                                            name='restaurantName'
                                            id='restaurantName'
                                            placeholder="Enter restaurant name"
                                            onChange={handleChange}
                                            value={credentials.restaurantName}
                                            required
                                            minLength={5}
                                        />
                                        <UilRestaurant className='icon' />
                                    </div>
                                </div>
                                <div className='my-3 col-lg-6 col-md-12'>
                                    <div className='input-field'>
                                        <input
                                            disabled={true}
                                            type='text'
                                            name='gstNumber'
                                            placeholder="Enter GST number"
                                            id='gstNumber'
                                            onChange={handleChange}
                                            value={credentials.gstNumber}
                                            required
                                            minLength={15}
                                            maxLength={15}
                                        />
                                        <UilDialpadAlt className='icon' />
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='my-3 col-lg-6 col-md-12'>
                                    <div className='input-field'>
                                        <input
                                            disabled={true}
                                            type='text'
                                            name='contactPerson'
                                            placeholder="Enter person name"
                                            id='contactPerson'
                                            onChange={handleChange}
                                            value={credentials.contactPerson}
                                            required
                                            minLength={5}
                                        />
                                        <UilUser className='icon' />
                                    </div>
                                </div>
                                <div className='my-3 col-lg-6 col-md-12'>
                                    <div className='input-field'>
                                        <input
                                            disabled={true}
                                            type='tel'
                                            name='contactPhone'
                                            placeholder="Enter contact number"
                                            id='contactPhone'
                                            onChange={handleChange}
                                            value={credentials.contactPhone}
                                            required
                                            minLength={10}
                                            maxLength={10}
                                        />
                                        <UilPhone className='icon' />
                                    </div>

                                </div>
                            </div>
                            <div className='row'>
                                <div className='my-3 col-lg-6 col-md-12'>
                                    <div className='input-field'>
                                        <input
                                            disabled={true}
                                            type='email'
                                            name='email'
                                            id='email'
                                            placeholder="Enter email address"
                                            aria-describedby='emailHelp'
                                            onChange={handleChange}
                                            value={credentials.email}
                                            required
                                            minLength={5}
                                        /><UilEnvelope className='icon' />
                                    </div>
                                </div>
                                <div className='my-3 col-lg-6 col-md-12'>
                                    <div className='input-field'> <input
                                        type='email'
                                        name='altEmail'
                                        disabled={true}
                                        id='altEmail'
                                        placeholder='Enter alternate email address'
                                        aria-describedby='emailHelp'
                                        onChange={handleChange}
                                        value={credentials.altEmail}

                                    /><UilEnvelopeAdd className='icon' />
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='my-3 col-lg-6 col-md-12'>
                                    <div className='input-field'>
                                        <input
                                            type='text'
                                            disabled={true}
                                            name='altContactPerson'
                                            id='altContactPerson'
                                            placeholder='Enter alternate contact name'
                                            onChange={handleChange}
                                            value={credentials.altContactPerson}
                                        /><UilUserPlus className='icon' />
                                    </div>

                                </div>
                                <div className='my-3 col-lg-6 col-md-12'>
                                    <div className='input-field'>
                                        <input
                                            disabled={true}
                                            type='tel'
                                            name='altContactPhone'
                                            id='altContactPhone'
                                            placeholder='Enter alternate contact number'
                                            onChange={handleChange}
                                            value={credentials.altContactPhone}
                                        /><UilPhoneAlt className='icon' />
                                    </div>

                                </div>
                            </div>
                            <div className='row'>
                                <div className='my-3 col-md-6 col-sm-12'>
                                    <div className='input-field' style={{ minHeight: "50px" }}>
                                        <input
                                            disabled={true}
                                            type='file'
                                            name='image1'
                                            id='image1'
                                            onChange={handleFileChange}
                                            accept='image/*'
                                            required
                                        />
                                        <div style={{ display: "flex", minHeight: "2vh" }}>
                                            <label htmlFor='image1' className='custom-file-input' style={{ display: "flex", minWidth: "100%" }}>
                                                <UilImage className='icon' style={{ width: "10%", marginBottom: "1rem" }} />
                                                <p style={editing ? { color: "black", marginRight: "3px", width: "85%" } : { color: "#747474", marginRight: "3px", width: "95%" }}>{image1Name || 'Upload Image 1 Here'}</p>

                                            </label>
                                        </div>

                                    </div>
                                </div>
                                <div className='my-3 col-md-6 col-sm-12'>
                                    <div className='input-field' >
                                        <input
                                            disabled={!editing}
                                            type='file'
                                            name='image2'
                                            id='image2'
                                            onChange={handleFileChange}
                                            accept='image/*'
                                        />
                                        <div style={{ display: "flex", minHeight: "2vh" }}>
                                            <label htmlFor='image2' className='custom-file-input' style={{ display: "flex", minWidth: "100%" }}>
                                                <UilImagePlus className='icon' />
                                                <p style={editing ? { color: "black", marginRight: "3px", width: "85%" } : { color: "#747474", marginRight: "3px", width: "95%" }}>{image2Name || 'Upload Image 2 Here'}</p>
                                            </label>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className='row'>
                                <div className='my-3 col-lg-6 col-md-12'>
                                    <Autocomplete
                                        onLoad={(autocomplete) => {
                                            setLoading(false);
                                            autocompleteRef.current = autocomplete;
                                        }}
                                        onPlaceChanged={onPlaceChanged}
                                    >
                                        <div className='input-field'>
                                            <input
                                                disabled={true}
                                                type='text'
                                                name='location'
                                                id='location'
                                                aria-describedby='locationHelp'
                                                onChange={handleChange}
                                                value={credentials.location}
                                                required
                                                placeholder='Enter restaurant address'
                                            /><UilLocationPoint className='icon' /></div>
                                    </Autocomplete>
                                </div>
                                <div className='my-3 col-lg-6 col-md-12'>
                                    <div className='input-field'>
                                        <select style={{ backgroundColor: "white", color: "#747474" }}
                                            name='registrationDuration'
                                            className='form-select'
                                            id='registrationDuration'
                                            onChange={(e) => {
                                                handleChange(e);
                                                if (e.target.value === "6 months")
                                                    setAmount(1);
                                                else
                                                    setAmount(2);
                                            }}
                                            onClick={(event) => {
                                                event.target.style.borderTop = 'none';
                                                event.target.style.boxShadow = 'none';
                                            }}
                                            value={credentials.registrationDuration}

                                            required
                                        >
                                            <option value='6 months'>6 months</option>
                                            <option value='12 months'>12 months</option>
                                        </select>
                                        <UilClock className='icon' />
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='input-field button'>
                                    <input type="submit" value={`Renew Membership at \u20B9${amount}\\-`} disabled={disabled}/>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <p className='previewTitle poppins-medium'>Preview of Images Uploaded</p>
            <div className='previewContainer'>
                {image1 && <img src={image1} alt='First offer photograph' ></img>}
                {image2 && <img src={image2} alt='Second offer photograph' ></img>}
            </div></>
    );
};

export default RenewForm;
