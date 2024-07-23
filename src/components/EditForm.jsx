import React, { useState, useRef, useContext, useEffect } from 'react';
import axios from 'axios';
import RestaurantContext from '../context/RestaurantContext';
import { Autocomplete } from '@react-google-maps/api';
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
import { useNavigate } from 'react-router-dom';
import '../App.css'
const EditForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // State to track loading status
  console.log('Loading:',loading)
  axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';
  const { restaurant, editRestaurant, displayAlert } = useContext(RestaurantContext);//set the restaurant
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
          displayAlert('Session Expired','success');
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

  const [credentials, setCredentials] = useState({
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
  const fromDate = new Date(restaurant.registrationDate).toLocaleDateString();
  const toDate = new Date(restaurant.expiryDate).toLocaleDateString();
  const [editing, setEditing] = useState(false);//initially form is just in display mode; Once user clicks the edit button we enable editing.
  const [image1, setImage1] = useState(`/images/${restaurant.image1}`);//this is used for preview
  const src2 = restaurant.image2 ? `/images/${restaurant.image2}` : null;
  const [image2, setImage2] = useState(src2);
  const [updatedImage1, setUpdatedImage1] = useState(null);//this is used for upload when user clicks the done button
  const [updatedImage2, setUpdatedImage2] = useState(null);
  const [image1Name, setImage1Name] = useState(`/images/${restaurant.image1}`);
  const [image2Name, setImage2Name] = useState(src2);
  const [image2Removed, setImage2Removed] = useState(false); //tracls if image2 has been removed or not


  const autocompleteRef = useRef(null);


  const handleFileChange = (event) => {
    const { name, files } = event.target;
    if (name === 'image1') {
      setImage1(URL.createObjectURL(files[0]));//creates a temporary url representing the selected file
      setUpdatedImage1(files[0]);
      setImage1Name(files[0].name)

    }
    else if (name === 'image2') {
      setImage2(URL.createObjectURL(files[0]));//creates a temporary url representing the selected file
      console.log('In edit form ', image2);
      setUpdatedImage2(files[0]);
      setImage2Name(files[0].name);

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
            <p className='poppins-less-bold' style={{ textAlign: "center", marginTop: "30px", fontSize: "20px" }}>Your current details</p>
            <form encType='multipart/form-data'>
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
                    disabled={!editing}
                    type='email'
                    name='altEmail'
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
                      disabled={!editing}
                      type='text'
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
                      disabled={!editing}
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
                      disabled={!editing}
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
                      {image1Name && editing && <CancelIcon style={{ width: "9%", margin: "auto", position: "relative", left: "-10px" }} onClick={() => {
                        setImage1Name('');

                        setImage1(null);
                        setUpdatedImage1(null);
                      }}></CancelIcon>}
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
                      {image2Name && editing && <CancelIcon style={{ width: "9%", margin: "auto", position: "relative", left: "-10px" }} onClick={() => {
                        setImage2Name('');

                        setImage2Removed(true);//meaning image 2 has been removed
                        setImage2(null);
                        setUpdatedImage2(null);

                      }}></CancelIcon>}
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
                      disabled={true}
                      name='registrationDuration'
                      className='form-select'
                      id='registrationDuration'
                      onChange={(e) => {
                        handleChange(e);
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
                    <input
                      disabled={true}
                      type='text'
                      name='from'
                      id='from'
                      placeholder={`Valid From: ${fromDate}`}
                      style={{ color: "black" }}
                    /> <UilClock className='icon' />
                  </div>

                </div>
                <div className='my-3 col-lg-6 col-md-12'>
                  <div className='input-field'>
                    <input
                      disabled={true}
                      type='text'
                      color='black'
                      name='to'
                      id='to'
                      placeholder={`Valid Till: ${toDate}`}
                      style={{ color: "black" }}
                    /> <UilClock className='icon' />
                  </div>
                </div>
              </div>
              <div className='row'>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  {!editing && restaurant.isActive && <EditIcon style={{ color: "#7e22ce" }} onClick={() => {
                    setEditing(true);//set Editing mode to true thus allowing registered customer to edit images etc.

                  }} />}
                  {editing && <><DoneIcon style={{ color: "#7e22ce", marginRight: "10px" }} onClick={async () => {
                    try {
                      await editRestaurant(updatedImage1, updatedImage2, restaurant._id, credentials.altContactPerson, credentials.altContactPhone, credentials.altEmail, image2Removed);
                      setEditing(false);//set Editing mode to false after saving edited info
                    }
                    catch (error) {
                      console.log(error, "Error occured in editing the form. Check the EditForm component.")
                    }
                  }} /><CancelIcon style={{ color: "#7e22ce" }} onClick={() => {
                    setCredentials({//revert to the original state
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
                    setImage1(`/images/${restaurant.image1}`);//revert image to previous state
                    setImage2(src2);
                    displayAlert('Successfully cancelled the changes!', 'success');
                    setEditing(false);//set Editing mode to false cancelling all the changes made and reverting back to the original state
                  }} /></>}
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
export default EditForm;
