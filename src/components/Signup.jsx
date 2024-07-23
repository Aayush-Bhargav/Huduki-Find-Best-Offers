import React, { useState, useRef, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import RestaurantContext from '../context/RestaurantContext';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import PlaceIcon from '@mui/icons-material/Place';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CallIcon from '@mui/icons-material/Call';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Razorpay from 'razorpay'
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
import { UilUpload } from '@iconscout/react-unicons';
import CancelIcon from '@mui/icons-material/Cancel';
import { Navigate, useNavigate } from 'react-router-dom';
import '../App.css'

const host = 'http://localhost:5000';

const Signup = () => {
  axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';
  const { addRestaurant, displayAlert, fetchRestaurants } = useContext(RestaurantContext);
  const [updatedImage1, setUpdatedImage1] = useState(null);//this is used for upload when user clicks the done button
  const [updatedImage2, setUpdatedImage2] = useState(null);
  const [updatedLogo, setUpdatedLogo] = useState(null);
  const [disabled, setDisabled] = useState(false); //to disable the register button once it is clicked until a response is received
  const [credentials, setCredentials] = useState({
    restaurantName: '',
    email: '',
    contactPhone: '',
    contactPerson: '',
    altContactPerson: '',
    altContactPhone: '',
    gstNumber: '',
    altEmail: '',
    registrationDuration: '6 months',
    lat: 12.9716,
    lng: 77.5946,
    location: '',// Add location field to state
    address: ''
  });
  const navigate = useNavigate();
  const [image1Name, setImage1Name] = useState('');
  const [image2Name, setImage2Name] = useState('');
  const [logoName, setLogoName] = useState('');
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image1Display, setImage1Display] = useState(null);
  const [image2Display, setImage2Display] = useState(null);
  const [logoDisplay, setLogoDisplay] = useState(null);
  const [logo, setLogo] = useState(null);
  const [amount, setAmount] = useState(1);//as default registration duration is 6 months
  const autocompleteRef = useRef(null);

  const createUser = async (formData, razorpay_order_id, razorpay_payment_id, razorpay_signature, amount) => {//call api to create restaurant with given details
    try {
      console.log('In create user ')
      let response1 = await axios.post(`${host}/api/restaurant/create-user`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('response from create user:', response1);
      console.log(response1.newRestaurant)
      addRestaurant(response1.data.newRestaurant);//add this to our local copy of list of restaurants
      let response = await axios.post(`${host}/api/payment/payment-details`, { //call the api responsible for saving payment details
        amount: amount,
        restaurantId: response1.data.newRestaurant._id,
        razorpay_order_id: razorpay_order_id,
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature: razorpay_signature,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('payment:', response);
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
        "description": "Membership Payment",
        "image": "https://example.com/your_logo",
        "order_id": order.id, //This is the `id` obtained in the response of previous post request
        "handler": async function (response) { //this function runs on successful verification

          // // Verify payment
          try {
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
              if (logo) formData.append('logo', logo);
              formData.append('amount', order.amount);//add amount also to the form data 
              await createUser(formData, response.razorpay_order_id, response.razorpay_payment_id, response.razorpay_signature, order.amount);
              // if it is still here, it means register success
              displayAlert('Successfully Registered to Huduki!', 'success');

              await fetchRestaurants();
              navigate("/login");

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
      setDisabled(false);
    }

  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    if (name === 'image1') {
      setImage1(files[0]);
      setImage1Name(files[0].name);
      setImage1Display(URL.createObjectURL(files[0]));//creates a temporary url representing the selected file
    }
    else if (name === 'image2') {
      setImage2(files[0]);
      setImage2Name(files[0].name);
      setImage2Display(URL.createObjectURL(files[0]));//creates a temporary url representing the selected file
      setUpdatedImage2(files[0]);
    }
    else if (name === 'logo') {
      setLogo(files[0]);
      setLogoName(files[0].name);
      setLogoDisplay(URL.createObjectURL(files[0]));//creates a temporary url representing the selected file
      setUpdatedLogo(files[0]);
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
            <span className='poppins-semibold title '>Register to Huduki!</span>
            <form onSubmit={handleSubmit} encType='multipart/form-data'>
              <div className='row'>
                <div className='my-3 col-lg-6 col-md-12'>
                  <div className='input-field'>
                    <input
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
                  {/* <label htmlFor='restaurantName' className='form-label'>
              <RestaurantIcon /><b style={{ marginLeft: "2px" }}>Restaurant Name</b>
            </label> */}

                </div>
                <div className='my-3 col-lg-6 col-md-12'>
                  <div className='input-field'>
                    {/* <label htmlFor='gstNumber' className='form-label'>
              <DinnerDiningIcon /><b style={{ marginLeft: "2px" }}>GST Number</b>
            </label> */}
                    <input
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
                    {/* <label htmlFor='contactPerson' className='form-label'>
              <PersonIcon /><b style={{ marginLeft: "2px" }}>Contact Person</b>
            </label> */}
                    <input
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
                    {/* <label htmlFor='contactPhone' className='form-label'>
              <CallIcon /><b style={{ marginLeft: "2px" }}>Contact Phone</b>
            </label> */}
                    <input
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
                <div className='my-3 col-lg-6 col-md-12' >
                  <div className='input-field'>
                    <input
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
                  {/* <label htmlFor='email' className='form-label'>
              <EmailIcon /><b style={{ marginLeft: "2px" }}>Email address</b>
            </label> */}

                  {/* <div id='emailHelp' className='form-text'>
              We'll never share your email with anyone else.
            </div> */}
                </div>
                <div className='my-3 col-lg-6 col-md-12'>
                  <div className='input-field'> <input
                    type='email'
                    name='altEmail'
                    id='altEmail'
                    placeholder='Enter alternate email address'
                    aria-describedby='emailHelp'
                    onChange={handleChange}
                    value={credentials.altEmail}

                  /><UilEnvelopeAdd className='icon' />
                  </div>
                  {/* <label htmlFor='altEmail' className='form-label'>
              <AlternateEmailIcon /><b style={{ marginLeft: "2px" }}>Alternate Email address</b>
            </label> */}

                  {/* <div id='emailHelp' className='form-text'>
              We'll never share your email with anyone else.
            </div> */}
                </div>
              </div>
              <div className='row'>
                <div className='my-3 col-lg-6 col-md-12'>
                  <div className='input-field'>
                    <input
                      type='text'
                      name='altContactPerson'
                      id='altContactPerson'
                      placeholder='Enter alternate contact name'
                      onChange={handleChange}
                      value={credentials.altContactPerson}
                    /><UilUserPlus className='icon' />
                  </div>
                  {/* <label htmlFor='altContactPerson' className='form-label'>
              <PersonAddAlt1Icon /><b style={{ marginLeft: "2px" }}>Alternate Contact Person</b>
            </label> */}

                </div>
                <div className='my-3 col-lg-6 col-md-12'>
                  <div className='input-field'>
                    {/* <label htmlFor='altContactPhone' className='form-label'>
                <AddIcCallIcon /><b style={{ marginLeft: "2px" }}>Alternate Contact Phone</b>
              </label> */}
                    <input
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
                <div className='my-3 col-md-6 col-sm-12' >
                  <div className='input-field' >
                    {/* <label htmlFor='image1' className='form-label'>
              <InsertPhotoIcon /><b style={{ marginLeft: "2px" }}>Image 1</b>
            </label> */}
                    <input
                      type='file'
                      name='image1'
                      // className='form-control'
                      id='image1'
                      onChange={handleFileChange}
                      accept='image/*'
                      required
                    />
                    <div style={{ display: "flex", minHeight: "2vh" }}><label htmlFor='image1' className='custom-file-input' style={{ display: "flex", minWidth: "100%" }}>
                      <UilImage className='icon' />
                      <p style={image1Name ? { color: "black" } : { color: "#747474" }}>{image1Name || 'Upload Image 1 Here'}</p>
                    </label>
                      {image1Name && <CancelIcon style={{ width: "9%", margin: "auto", position: "relative", left: "-10px" }} onClick={() => {
                        setImage1Name('');
                        setImage1(null);
                        setImage1Display(null);
                        setUpdatedImage1(null);
                      }}></CancelIcon>}</div>
                  </div>
                </div>
                <div className='my-3 col-md-6 col-sm-12'>
                  <div className='input-field' >
                    {/* <label htmlFor='image2' className='form-label'>
                <AddPhotoAlternateIcon /><b style={{ marginLeft: "2px" }}>Image 2</b>
              </label> */}
                    <input
                      type='file'
                      name='image2'

                      id='image2'
                      onChange={handleFileChange}
                      accept='image/*'
                    />
                    <div style={{ display: "flex", minHeight: "2vh" }}> <label htmlFor='image2' className='custom-file-input' style={{ display: "flex", minWidth: "100%" }}>
                      <UilImagePlus className='icon' />
                      <p style={image2Name ? { color: "black" } : { color: "#747474" }}>
                        {image2Name || 'Upload Image 2 Here'}</p>
                    </label>
                      {image2Name && <CancelIcon style={{ width: "9%", margin: "auto", position: "relative", left: "-10px" }} onClick={() => {
                        setImage2Name('');
                        setImage2(null);
                        setImage2Display(null);
                        setUpdatedImage2(null);
                      }}></CancelIcon>}</div>

                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='my-3 col-lg-6 col-md-12'>

                  {/* <label htmlFor='location' className='form-label'>
              <PlaceIcon /><b style={{ marginLeft: "2px" }}>Location</b>
            </label> */}
                  {/* <LoadScript googleMapsApiKey='AIzaSyAkzD8dg5FdfKM52FLZwXXhLK8Rzw5yv8Q' libraries={['places']} > */}
                  <Autocomplete
                    onLoad={(autocomplete) => {
                      autocompleteRef.current = autocomplete;
                    }}
                    onPlaceChanged={onPlaceChanged}
                  >
                    <div className='input-field'>
                      <input
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
                  {/* </LoadScript> */}
                </div>

                <div className='my-3 col-lg-6 col-md-12'>
                  <div className='input-field'>
                    {/* <label htmlFor='registrationDuration' className='form-label'>
                <AccessTimeIcon /><b style={{ marginLeft: "2px" }}>Registration Duration</b>
              </label> */}
                    <select
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
                <div className='my-3 col-lg-6 col-md-12'>
                  <div className='input-field'>
                    {/* <label htmlFor='image1' className='form-label'>
              <InsertPhotoIcon /><b style={{ marginLeft: "2px" }}>Image 1</b>
            </label> */}
                    <input
                      type='file'
                      name='logo'
                      id='logo'
                      placeholder='Place Logo Here'
                      onChange={handleFileChange}
                      accept='image/*'
                      required

                    />
                    <div style={{ display: "flex", minHeight: "2vh" }}>
                      <label htmlFor='logo' className='custom-file-input' style={{ display: "flex", minWidth: "100%" }}>
                        <UilUpload className='icon' />
                        <p style={logoName ? { color: "black" } : { color: "#747474" }}>{logoName || 'Upload Logo Here'}</p>
                      </label>
                      {logoName && <CancelIcon style={{ width: "9%", margin: "auto", position: "relative", left: "-10px" }} onClick={() => {
                        setLogoName('')
                        setLogo(null);
                        setLogoDisplay(null);
                        setUpdatedLogo(null);
                      }}></CancelIcon>}
                    </div>

                  </div>
                </div>

              </div>
              <div className='row'>

                <div className='input-field button'>
                  <input type="submit" value={`Register at \u20B9${amount}\\-`} disabled={disabled}/>
                </div>
              </div>




            </form>
          </div>
        </div >
      </div >
      <p className='previewTitle poppins-medium'>Preview of Images Uploaded</p>
      <div className='previewContainer'>
        {!image1Display && !image2Display && <p>Nothing to Display</p>}
        {image1Display && <img src={image1Display} alt='First offer photograph' ></img>}
        {image2Display && <img src={image2Display} alt='Second offer photograph' ></img>}
      </div>
      <p className='previewTitle poppins-medium'>Preview of Logo</p>
      <div className='previewContainer'>
        {logoDisplay ? <img src={logoDisplay} alt='First offer photograph' ></img> : <p>Nothing to Display</p>}

      </div>
    </>

  );
};

export default Signup;
