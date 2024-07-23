// import React, { useState, useCallback, useRef } from 'react';
// import axios from 'axios';
// import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
// import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';

// const containerStyle = {
//   width: '100%',
//   height: '400px'
// };


// export default function Signup() {
//   axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';
//   const host = "http://localhost:5000";
//   const [credentials, setCredentials] = useState({
//     restaurantName: "", email: "", contactPhone: "", contactPerson: "",
//     altContactPerson: "", altContactPhone: "", gstNumber: "",
//     altEmail: "", registrationDuration: "6 months", lat: 12.9716, lng: 77.5946
//   });
//   const [center, setCenter] = useState({ lat: 12.9716, lng: 77.5946 }); // Default to Bengaluru

//   const [image1, setImage1] = useState(null);
//   const [image2, setImage2] = useState(null);
//   const [location, setLocation] = useState(center);
//   const [lat, setLat] = useState(12.9716);
//   const [lng, setLng] = useState(77.5946);
//   const mapRef = useRef(null);


//   async function createUser(formData) {
//     try {
//       const response = await axios.post(`${host}/api/restaurant/createUser`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         }
//       });
//       console.log(response);
//     } catch (error) {
//       console.error('Error posting data:', error.response);
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     Object.keys(credentials).forEach(key => formData.append(key, credentials[key]));
//     if (image1) formData.append('image1', image1);
//     if (image2) formData.append('image2', image2);

//     await createUser(formData);
//   };

//   const handleFileChange = (event) => {
//     const { name, files } = event.target;
//     if (name === 'image1') setImage1(files[0]);
//     else if (name === 'image2') setImage2(files[0]);
//   };

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setCredentials({ ...credentials, [name]: value });
//   };

//   const handleMapClick = (event) => {
//     const newLocation = {
//       lat: event.latLng.lat(),
//       lng: event.latLng.lng()
//     };
//     setLat(newLocation.lat);
//     setLng(newLocation.lng);
//     setLocation(newLocation);
//     setCredentials({ ...credentials, lat: newLocation.lat, lng: newLocation.lng });
//   };

//   const { ready, value, suggestions: { status, data }, setValue, clearSuggestions } = usePlacesAutocomplete({
//     requestOptions: { location: { lat: () => center.lat, lng: () => center.lng }, radius: 1000 * 1000 }
//   });

//   const handleInput = (e) => setValue(e.target.value);

//   const handleSelect = async (address) => {
//     setValue(address, false);
//     clearSuggestions();
//     try {
//       const results = await getGeocode({ address });
//       const { lat, lng } = await getLatLng(results[0]);
//       setLocation({ lat, lng });
//       setCenter({ lat, lng })
//       setCredentials({ ...credentials, lat: lat, lng: lng });
//     } catch (error) {
//       console.error("Error: ", error);
//     }
//   };

//   const renderSuggestions = () => data.map((suggestion) => {
//     const { place_id, structured_formatting: { main_text, secondary_text } } = suggestion;
//     return (
//       <div key={place_id} onClick={() => handleSelect(suggestion.description)}>
//         <strong>{main_text}</strong> <small>{secondary_text}</small>
//       </div>
//     );
//   });

//   return (
//     <div className='container my-3'>
//       <h2 className='my-3' style={{ textAlign: "center" }}><b>Register to Huduki!</b></h2>
//       <form onSubmit={handleSubmit} encType="multipart/form-data">
//         <div className='row'>
//           <div className="my-3 col-lg-6 col-md-12">
//             <label htmlFor="restaurantName" className="form-label"><b>Restaurant Name</b></label>
//             <input type="text" name="restaurantName" className="form-control" id="restaurantName" onChange={handleChange} value={credentials.restaurantName} required minLength={5} />
//           </div>
//           <div className="my-3 col-lg-6 col-md-12">
//             <label htmlFor="gstNumber" className="form-label"><b>GST Number</b></label>
//             <input type="text" name="gstNumber" className="form-control" id="gstNumber" onChange={handleChange} value={credentials.gstNumber} required minLength={15} maxLength={15} />
//           </div>
//         </div>
//         <div className='row'>
//           <div className="my-3 col-lg-6 col-md-12">
//             <label htmlFor="contactPerson" className="form-label"><b>Contact Person</b></label>
//             <input type="text" name="contactPerson" className="form-control" id="contactPerson" onChange={handleChange} value={credentials.contactPerson} required minLength={5} />
//           </div>
//           <div className="my-3 col-lg-6 col-md-12">
//             <label htmlFor="contactPhone" className="form-label"><b>Contact Phone</b></label>
//             <input type="tel" name="contactPhone" className="form-control" id="contactPhone" onChange={handleChange} value={credentials.contactPhone} required minLength={10} maxLength={10} />
//           </div>
//         </div>
//         <div className='row'>
//           <div className="my-3 col-lg-6 col-md-12">
//             <label htmlFor="email" className="form-label"><b>Email address</b></label>
//             <input type="email" name="email" className="form-control" id="email" aria-describedby="emailHelp" onChange={handleChange} value={credentials.email} required minLength={5} />
//             <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
//           </div>
//           <div className="my-3 col-lg-6 col-md-12">
//             <label htmlFor="altEmail" className="form-label"><b>Alternate Email address</b></label>
//             <input type="email" name="altEmail" className="form-control" id="altEmail" aria-describedby="emailHelp" onChange={handleChange} value={credentials.altEmail} />
//             <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
//           </div>
//         </div>
//         <div className='row'>
//           <div className="my-3 col-lg-6 col-md-12">
//             <label htmlFor="altContactPerson" className="form-label"><b>Alternate Contact Person</b></label>
//             <input type="text" name="altContactPerson" className="form-control" id="altContactPerson" onChange={handleChange} value={credentials.altContactPerson} />
//           </div>
//           <div className="my-3 col-lg-6 col-md-12">
//             <label htmlFor="altContactPhone" className="form-label"><b>Alternate Contact Phone</b></label>
//             <input type="tel" name="altContactPhone" className="form-control" id="altContactPhone" onChange={handleChange} value={credentials.altContactPhone} />
//           </div>
//         </div>
//         <div className='row'>
//           <div className="my-3 col-md-6 col-sm-12">
//             <label htmlFor="image1" className="form-label" ><b>Image 1</b></label>
//             <input type="file" name="image1" className="form-control" id="image1" onChange={handleFileChange} accept="image/*" required />
//           </div>
//           <div className="my-3 col-md-6 col-sm-12">
//             <label htmlFor="image2" className="form-label "><b>Image 2</b></label>
//             <input type="file" name="image2" className="form-control" id="image2" onChange={handleFileChange} accept="image/*" />
//           </div>
//         </div>
//         <div className='row'>
//           <div className="my-3 col-lg-6 col-md-12">
//             <label htmlFor="location" className="form-label"><b>Location</b></label>
//             <input type="text" name="location" className="form-control" id="location" aria-describedby="locationHelp" onChange={handleInput} value={value} required />
//             {status === 'OK' && <div>{renderSuggestions()}</div>}
//           </div>
//           <div className="my-3 col-lg-6 col-md-12">
//             <label htmlFor="registrationDuration" className="form-label"><b>Registration Duration</b></label>
//             <select name="registrationDuration" className="form-control" id="registrationDuration" onChange={handleChange} value={credentials.registrationDuration}>
//               <option value="6 months">6 months</option>
//               <option value="12 months">12 months</option>
//             </select>
//           </div>
//         </div>
//         <div className='my-3'>
//           <LoadScript googleMapsApiKey="AIzaSyAkzD8dg5FdfKM52FLZwXXhLK8Rzw5yv8Q" libraries={['places']}>
//             <GoogleMap
//               mapContainerStyle={containerStyle}
//               center={location}
//               zoom={10}
//               onClick={handleMapClick}
//               ref={mapRef}
//             >
//               <Marker position={location} />
//             </GoogleMap>
//           </LoadScript>
//         </div>
//         <button type="submit" className="btn btn-primary">Submit</button>
//       </form>
//     </div>
//   );
// }
// ---------------------

// import React, { useState, useCallback, useRef } from 'react';
// import axios from 'axios';
// import { GoogleMap, LoadScript, Marker, useJsApiLoader } from '@react-google-maps/api';
// import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
// const containerStyle = {
//   width: '100%',
//   height: '400px'
// };

// const center = {
//   lat: -3.745,
//   lng: -38.523
// };
// export default function Login() {
//   // Set default headers for Axios to send JSON content
//   axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';
//   //   const { displayAlert } = useContext(noteContext);
//   //   let history = useNavigate();

//   const host = "http://localhost:5000"
//   const [credentials, setCredentials] = useState({ restaurantName: "", email: "", contactPhone: "", contactPerson: "", altContactPerson: "", altContactPhone: "", gstNumber: "", altEmail: "", registrationDuration: "6 months" });
//   const [image1, setImage1] = useState(null);
//   const [image2, setImage2] = useState(null);
//   const [location, setLocation] = useState(center);
//   const [lat, setLat] = useState(0);
//   const [lng, setLng] = useState(0);
//   const mapRef = useRef(null);
//   async function createUser(formData) {//function to add a note USING our backend api
//     let response;
//     try {
//       response = await axios.post(`${host}/api/auth/createUser`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         }
//       });

//       console.log(response);
//       //if it is still here, it means sign up success
//       //   displayAlert("Welcome aboard! Account Created Successfully!", 'success');
//       //save the authtoken and redirect
//       //   localStorage.setItem('token', response.data.authtoken);
//       //   history("/");
//     } catch (error) {
//       //   displayAlert("Couldn't Sign Up. Try again.", 'danger');
//       console.error('Error posting data:', error.response);
//     }
//   }
//   const handleSubmit = async (e) => {
//     e.preventDefault(); //prevent default action that happens when a form is submitted
//     // await createUser(credentials.restuarantName, credentials.email, credentials.contactPhone, credentials.contactPerson, credentials.altContactPerson, credentials.altContactPhone, credentials.gstNumber, credentials.altEmail);
//     const formData = new FormData();
//     Object.keys(credentials).forEach(key => formData.append(key, credentials[key]));
//     if (image1) formData.append('image1', image1);
//     if (image2) formData.append('image2', image2);

//     await createUser(formData);

//   }
//   const handleFileChange = (event) => {
//     const { name, files } = event.target;
//     if (name === 'image1') {
//       setImage1(files[0]);
//     } else if (name === 'image2') {
//       setImage2(files[0]);
//     }

//   }
//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setCredentials((credentials) => {
//       return { ...credentials, [name]: value };
//     });
//   }
//   const onLoad = useCallback(function callback(map) {
//     mapRef.current = map;
//   }, []);

//   const onUnmount = useCallback(function callback(map) {
//     mapRef.current = null;
//   }, []);

//   const handleMapClick = (event) => {
//     const newLocation = {
//       lat: event.latLng.lat(),
//       lng: event.latLng.lng()
//     };
//     setLat(event.latLng.lat());
//     setLng(event.latLng.lng());
//     setLocation(newLocation);
//     setCredentials((credentials) => ({
//       ...credentials,
//       lat: newLocation.lat,
//       lng: newLocation.lng
//     }));
//   };
//   // Autocomplete setup
//   const {
//     ready,
//     value,
//     suggestions: { status, data },
//     setValue,
//     clearSuggestions,
//   } = usePlacesAutocomplete({
//     requestOptions: {
//       location: { lat: () => -3.745, lng: () => -38.523 },
//       radius: 200 * 1000,
//     },
//   });
//   const handleInput = (e) => {
//     setValue(e.target.value);
//   };

//   const handleSelect = async (address) => {
//     setValue(address, false);
//     clearSuggestions();

//     try {
//       const results = await getGeocode({ address });
//       const { lat, lng } = await getLatLng(results[0]);
//       setLocation({ lat, lng });
//       setCredentials((credentials) => ({
//         ...credentials,
//         location: { lat, lng },
//         address,
//       }));
//     } catch (error) {
//       console.error("Error: ", error);
//     }
//   };

//   const renderSuggestions = () =>
//     data.map((suggestion) => {
//       const {
//         place_id,
//         structured_formatting: { main_text, secondary_text },
//       } = suggestion;

//       return (
//         <div key={place_id} onClick={() => handleSelect(suggestion.description)}>
//           <strong>{main_text}</strong> <small>{secondary_text}</small>
//         </div>
//       );
//     });
//   return (
//     <div className='container my-3'>
//       <h2 className='my-3' style={{ textAlign: "center" }}><b>Register to Huduki!</b></h2>
//       <form onSubmit={handleSubmit} encType="multipart/form-data">
//         <div className='row'>
//           <div className="my-3 col-lg-6 col-md-12">
//             <label htmlFor="restaurantName" className="form-label"><b>Restaurant Name</b></label>
//             <input type="text" name="restaurantName" className="form-control" id="name" onChange={handleChange} value={credentials.restaurantName} required minLength={5} />
//           </div>
//           <div className="my-3 col-lg-6 col-md-12">
//             <label htmlFor="gstNumber" className="form-label"><b>GST Number</b></label>
//             <input type="text" name="gstNumber" className="form-control" id="gstNumber" onChange={handleChange} value={credentials.gstNumber} required minLength={15} maxLength={15} />
//           </div>
//         </div>
//         <div className='row'>
//           <div className="my-3 col-lg-6 col-md-12">
//             <label htmlFor="contactPerson" className="form-label"><b>Contact Person</b></label>
//             <input type="text" name="contactPerson" className="form-control" id="contactPerson" onChange={handleChange} value={credentials.contactPerson} required minLength={5} />
//           </div>
//           <div className="my-3 col-lg-6 col-md-12">
//             <label htmlFor="contactPhone" className="form-label"><b>Contact Phone</b></label>
//             <input type="tel" name="contactPhone" className="form-control" id="contactPhone" onChange={handleChange} value={credentials.contactPhone} required minLength={10} maxLength={10} />
//           </div>
//         </div>
//         <div className='row'>
//           <div className="my-3 col-lg-6 col-md-12">
//             <label htmlFor="email" className="form-label"><b>Email address</b></label>
//             <input type="email" name="email" className="form-control" id="email" aria-describedby="emailHelp" onChange={handleChange} value={credentials.email} required minLength={5} />
//             <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
//           </div>
//           <div className="my-3 col-lg-6 col-md-12">
//             <label htmlFor="altEmail" className="form-label"><b>Alternate Email address</b></label>
//             <input type="email" name="altEmail" className="form-control" id="altEmail" aria-describedby="emailHelp" onChange={handleChange} value={credentials.altEmail} />
//             <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
//           </div>

//         </div>
//         <div className='row'>
//           <div className="my-3 col-lg-6 col-md-12">
//             <label htmlFor="altContactPerson" className="form-label"><b>Alternate Contact Person</b></label>
//             <input type="text" name="altContactPerson" className="form-control" id="altContactPerson" onChange={handleChange} value={credentials.altContactPerson} />
//           </div>
//           <div className="my-3 col-lg-6 col-md-12">
//             <label htmlFor="altContactPhone" className="form-label"><b>Alternate Contact Phone</b></label>
//             <input type="tel" name="altContactPhone" className="form-control" id="altContactPhone" onChange={handleChange} value={credentials.altContactPhone} />
//           </div>
//         </div>
//         <div className='row'>
//           <div className="my-3 col-md-6 col-sm-12">
//             <label htmlFor="image1" className="form-label" ><b>Image 1</b></label>
//             <input type="file" name="image1" className="form-control" id="image1" onChange={handleFileChange} accept="image/*" required />
//           </div>
//           <div className="my-3 col-md-6 col-sm-12">
//             <label htmlFor="image2" className="form-label "><b>Image 2</b></label>
//             <input type="file" name="image2" className="form-control" id="image2" onChange={handleFileChange} accept="image/*" />
//           </div>
//         </div>
//         <div className='row'>
//           <div className="my-3 col-lg-6 col-md-12">
//             <label htmlFor="location" className="form-label"><b>Location</b></label>
//             <input type="text" name="location" className="form-control" id="location" aria-describedby="locationHelp" onChange={handleInput} value={value} disabled={!ready} />
//             {status === "OK" && <div>{renderSuggestions()}</div>}
//             <div style={{ height: '400px', width: '100%' }}>
//               <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY" libraries={["places"]}>
//                 <GoogleMap
//                   mapContainerStyle={containerStyle}
//                   center={location}
//                   zoom={10}
//                   onLoad={onLoad}
//                   onUnmount={onUnmount}
//                   onClick={handleMapClick}
//                 >
//                   <Marker position={location} />
//                 </GoogleMap>
//               </LoadScript>
//             </div>
//           </div>
//         </div>
//         <div className='row'>
//           <div className="my-3 col-lg-6 col-md-12">
//             <label htmlFor="registrationDuration" className="form-label"><b>Registration Duration</b></label>
//             <select
//               className="form-select"
//               name="registrationDuration"
//               id="registrationDuration"
//               onChange={handleChange}
//               value={credentials.registrationDuration}
//               required
//             >
//               <option value="6 months">6 months</option>
//               <option value="12 months">12 months</option>
//             </select>
//           </div>
//         </div>


//         {/* <div className="mb-3 form-check">
//                     <input type="checkbox" className="form-check-input" id="exampleCheck1" />
//                     <label className="form-check-label" for="exampleCheck1">Check me out</label>
//                 </div> */}
//         <button type="submit" className="btn btn-primary my-3" >Submit</button>
//       </form>
//     </div>
//   )
// }

// -------------------------
// 

// import React, { useState, useRef } from 'react';
// import axios from 'axios';
// import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';

// const host = 'http://localhost:5000';

// const Signup = () => {
//   axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';

//   const [credentials, setCredentials] = useState({
//     restaurantName: '',
//     email: '',
//     contactPhone: '',
//     contactPerson: '',
//     altContactPerson: '',
//     altContactPhone: '',
//     gstNumber: '',
//     altEmail: '',
//     registrationDuration: '6 months',
//     lat: 12.9716,
//     lng: 77.5946
//   });

//   const [image1, setImage1] = useState(null);
//   const [image2, setImage2] = useState(null);
//   const autocompleteRef = useRef(null);

//   const createUser = async (formData) => {
//     try {
//       const response = await axios.post(`${host}/api/restaurant/createUser`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       console.log(response);
//     } catch (error) {
//       console.error('Error posting data:', error.response);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     Object.keys(credentials).forEach((key) => formData.append(key, credentials[key]));
//     if (image1) formData.append('image1', image1);
//     if (image2) formData.append('image2', image2);

//     await createUser(formData);
//   };

//   const handleFileChange = (event) => {
//     const { name, files } = event.target;
//     if (name === 'image1') setImage1(files[0]);
//     else if (name === 'image2') setImage2(files[0]);
//   };

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setCredentials({ ...credentials, [name]: value });
//   };

//   const onPlaceChanged = () => {
//     const place = autocompleteRef.current.getPlace();
//     if (!place.geometry) return;

//     const { lat, lng } = place.geometry.location.toJSON();
//     setCredentials({ ...credentials, lat, lng });
//   };

//   return (
//     <div className='container my-3'>
//       <h2 className='my-3' style={{ textAlign: 'center' }}>
//         <b>Register to Huduki!</b>
//       </h2>
//       <form onSubmit={handleSubmit} encType='multipart/form-data'>
//         <div className='row'>
//           <div className='my-3 col-lg-6 col-md-12'>
//             <label htmlFor='restaurantName' className='form-label'>
//               <b>Restaurant Name</b>
//             </label>
//             <input
//               type='text'
//               name='restaurantName'
//               className='form-control'
//               id='restaurantName'
//               onChange={handleChange}
//               value={credentials.restaurantName}
//               required
//               minLength={5}
//             />
//           </div>
//           <div className='my-3 col-lg-6 col-md-12'>
//             <label htmlFor='gstNumber' className='form-label'>
//               <b>GST Number</b>
//             </label>
//             <input
//               type='text'
//               name='gstNumber'
//               className='form-control'
//               id='gstNumber'
//               onChange={handleChange}
//               value={credentials.gstNumber}
//               required
//               minLength={15}
//               maxLength={15}
//             />
//           </div>
//         </div>
//         <div className='row'>
//           <div className='my-3 col-lg-6 col-md-12'>
//             <label htmlFor='contactPerson' className='form-label'>
//               <b>Contact Person</b>
//             </label>
//             <input
//               type='text'
//               name='contactPerson'
//               className='form-control'
//               id='contactPerson'
//               onChange={handleChange}
//               value={credentials.contactPerson}
//               required
//               minLength={5}
//             />
//           </div>
//           <div className='my-3 col-lg-6 col-md-12'>
//             <label htmlFor='contactPhone' className='form-label'>
//               <b>Contact Phone</b>
//             </label>
//             <input
//               type='tel'
//               name='contactPhone'
//               className='form-control'
//               id='contactPhone'
//               onChange={handleChange}
//               value={credentials.contactPhone}
//               required
//               minLength={10}
//               maxLength={10}
//             />
//           </div>
//         </div>
//         <div className='row'>
//           <div className='my-3 col-lg-6 col-md-12'>
//             <label htmlFor='email' className='form-label'>
//               <b>Email address</b>
//             </label>
//             <input
//               type='email'
//               name='email'
//               className='form-control'
//               id='email'
//               aria-describedby='emailHelp'
//               onChange={handleChange}
//               value={credentials.email}
//               required
//               minLength={5}
//             />
//             <div id='emailHelp' className='form-text'>
//               We'll never share your email with anyone else.
//             </div>
//           </div>
//           <div className='my-3 col-lg-6 col-md-12'>
//             <label htmlFor='altEmail' className='form-label'>
//               <b>Alternate Email address</b>
//             </label>
//             <input
//               type='email'
//               name='altEmail'
//               className='form-control'
//               id='altEmail'
//               aria-describedby='emailHelp'
//               onChange={handleChange}
//               value={credentials.altEmail}
//             />
//             <div id='emailHelp' className='form-text'>
//               We'll never share your email with anyone else.
//             </div>
//           </div>
//         </div>
//         <div className='row'>
//           <div className='my-3 col-lg-6 col-md-12'>
//             <label htmlFor='altContactPerson' className='form-label'>
//               <b>Alternate Contact Person</b>
//             </label>
//             <input
//               type='text'
//               name='altContactPerson'
//               className='form-control'
//               id='altContactPerson'
//               onChange={handleChange}
//               value={credentials.altContactPerson}
//             />
//           </div>
//           <div className='my-3 col-lg-6 col-md-12'>
//             <label htmlFor='altContactPhone' className='form-label'>
//               <b>Alternate Contact Phone</b>
//             </label>
//             <input
//               type='tel'
//               name='altContactPhone'
//               className='form-control'
//               id='altContactPhone'
//               onChange={handleChange}
//               value={credentials.altContactPhone}
//             />
//           </div>
//         </div>
//         <div className='row'>
//           <div className='my-3 col-md-6 col-sm-12'>
//             <label htmlFor='image1' className='form-label'>
//               <b>Image 1</b>
//             </label>
//             <input
//               type='file'
//               name='image1'
//               className='form-control'
//               id='image1'
//               onChange={handleFileChange}
//               accept='image/*'
//               required
//             />
//           </div>
//           <div className='my-3 col-md-6 col-sm-12'>
//             <label htmlFor='image2' className='form-label'>
//               <b>Image 2</b>
//             </label>
//             <input
//               type='file'
//               name='image2'
//               className='form-control'
//               id='image2'
//               onChange={handleFileChange}
//               accept='image/*'
//             />
//           </div>
//         </div>
//         <div className='row'>
//           <div className='my-3 col-lg-6 col-md-12'>
//             <label htmlFor='location' className='form-label'>
//               <b>Location</b>
//             </label>
//             <LoadScript googleMapsApiKey='AIzaSyAkzD8dg5FdfKM52FLZwXXhLK8Rzw5yv8Q' libraries={['places']} >
//               <Autocomplete
//                 onLoad={(autocomplete) => {
//                   autocompleteRef.current = autocomplete;
//                 }}
//                 onPlaceChanged={onPlaceChanged}
//               >
//                 <input
//                   type='text'
//                   name='location'
//                   className='form-control'
//                   id='location'
//                   aria-describedby='locationHelp'
//                   onChange={handleChange}
//                   value={credentials.location}
//                   required
//                   placeholder='Enter your address'
//                 />
//               </Autocomplete>
//             </LoadScript>
//           </div>
//           <div className='my-3 col-lg-6 col-md-12'>
//             <label htmlFor='registrationDuration' className='form-label'>
//               <b>Registration Duration</b>
//             </label>
//             <select
//               name='registrationDuration'
//               className='form-select'
//               id='registrationDuration'
//               onChange={handleChange}
//               value={credentials.registrationDuration}
//               required
//             >
//               <option value='6 months'>6 months</option>
//               <option value='12 months'>12 months</option>
//             </select>
//           </div>
//         </div>
//         <button type='submit' className='btn btn-primary mt-3'>
//           Register
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Signup;


import React, { useState, useRef } from 'react';
import axios from 'axios';
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
import { UilRestaurant } from '@iconscout/react-unicons';
import { UilDialpadAlt } from '@iconscout/react-unicons';

import '../App.css'

const host = 'http://localhost:5000';

const Signup = () => {
  axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';

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
    location: '' // Add location field to state
  });

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const autocompleteRef = useRef(null);

  const createUser = async (formData) => {
    try {
      const response = await axios.post(`${host}/api/restaurant/createUser`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response);
    } catch (error) {
      console.error('Error posting data:', error.response);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(credentials).forEach((key) => formData.append(key, credentials[key]));
    if (image1) formData.append('image1', image1);
    if (image2) formData.append('image2', image2);

    await createUser(formData);
  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    if (name === 'image1') setImage1(files[0]);
    else if (name === 'image2') setImage2(files[0]);
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
      location: place.formatted_address // Update location field with formatted address
    });
  };

  return (
    <div className='container my-4 ' >
      <h2 className='my-3 poppins-semibold' style={{ textAlign: 'center' }}>
        Register to Huduki!
      </h2>
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
            <label htmlFor='contactPerson' className='form-label'>
              <PersonIcon /><b style={{ marginLeft: "2px" }}>Contact Person</b>
            </label>
            <input
              type='text'
              name='contactPerson'
              placeholder="Enter person name"
              className='form-control'
              id='contactPerson'
              onChange={handleChange}
              value={credentials.contactPerson}
              required
              minLength={5}
            />
          </div>
          <div className='my-3 col-lg-6 col-md-12'>
            <label htmlFor='contactPhone' className='form-label'>
              <CallIcon /><b style={{ marginLeft: "2px" }}>Contact Phone</b>
            </label>
            <input
              type='tel'
              name='contactPhone'
              placeholder="Enter contact number"
              className='form-control'
              id='contactPhone'
              onChange={handleChange}
              value={credentials.contactPhone}
              required
              minLength={10}
              maxLength={10}
            />
          </div>
        </div>
        <div className='row'>
          <div className='my-3 col-lg-6 col-md-12'>
            <label htmlFor='email' className='form-label'>
              <EmailIcon /><b style={{ marginLeft: "2px" }}>Email address</b>
            </label>
            <input
              type='email'
              name='email'
              className='form-control'
              id='email'
              placeholder="Enter email address"
              aria-describedby='emailHelp'
              onChange={handleChange}
              value={credentials.email}
              required
              minLength={5}
            />
            <div id='emailHelp' className='form-text'>
              We'll never share your email with anyone else.
            </div>
          </div>
          <div className='my-3 col-lg-6 col-md-12'>
            <label htmlFor='altEmail' className='form-label'>
              <AlternateEmailIcon /><b style={{ marginLeft: "2px" }}>Alternate Email address</b>
            </label>
            <input
              type='email'
              name='altEmail'
              className='form-control'
              id='altEmail'
              aria-describedby='emailHelp'
              onChange={handleChange}
              value={credentials.altEmail}
            />
            <div id='emailHelp' className='form-text'>
              We'll never share your email with anyone else.
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='my-3 col-lg-6 col-md-12'>
            <label htmlFor='altContactPerson' className='form-label'>
              <PersonAddAlt1Icon /><b style={{ marginLeft: "2px" }}>Alternate Contact Person</b>
            </label>
            <input
              type='text'
              name='altContactPerson'
              className='form-control'
              id='altContactPerson'
              onChange={handleChange}
              value={credentials.altContactPerson}
            />
          </div>
          <div className='my-3 col-lg-6 col-md-12'>
            <label htmlFor='altContactPhone' className='form-label'>
              <AddIcCallIcon /><b style={{ marginLeft: "2px" }}>Alternate Contact Phone</b>
            </label>
            <input
              type='tel'
              name='altContactPhone'
              className='form-control'
              id='altContactPhone'
              onChange={handleChange}
              value={credentials.altContactPhone}
            />
          </div>
        </div>
        <div className='row'>
          <div className='my-3 col-md-6 col-sm-12'>
            <label htmlFor='image1' className='form-label'>
              <InsertPhotoIcon /><b style={{ marginLeft: "2px" }}>Image 1</b>
            </label>
            <input
              type='file'
              name='image1'
              className='form-control'
              id='image1'
              onChange={handleFileChange}
              accept='image/*'
              required
            />
          </div>
          <div className='my-3 col-md-6 col-sm-12'>
            <label htmlFor='image2' className='form-label'>
              <AddPhotoAlternateIcon /><b style={{ marginLeft: "2px" }}>Image 2</b>
            </label>
            <input
              type='file'
              name='image2'
              className='form-control'
              id='image2'
              onChange={handleFileChange}
              accept='image/*'
            />
          </div>
        </div>
        <div className='row'>
          <div className='my-3 col-lg-6 col-md-12'>
            <label htmlFor='location' className='form-label'>
              <PlaceIcon /><b style={{ marginLeft: "2px" }}>Location</b>
            </label>
            <LoadScript googleMapsApiKey='emo' libraries={['places']} >
              <Autocomplete
                onLoad={(autocomplete) => {
                  autocompleteRef.current = autocomplete;
                }}
                onPlaceChanged={onPlaceChanged}
              >
                <input
                  type='text'
                  name='location'
                  className='form-control'
                  id='location'
                  aria-describedby='locationHelp'
                  onChange={handleChange}
                  value={credentials.location}
                  required
                  placeholder='Enter restaurant address'
                />
              </Autocomplete>
            </LoadScript>
          </div>
          <div className='my-3 col-lg-6 col-md-12'>
            <label htmlFor='registrationDuration' className='form-label'>
              <AccessTimeIcon /><b style={{ marginLeft: "2px" }}>Registration Duration</b>
            </label>
            <select
              name='registrationDuration'
              className='form-select'
              id='registrationDuration'
              onChange={handleChange}
              value={credentials.registrationDuration}
              required
            >
              <option value='6 months'>6 months</option>
              <option value='12 months'>12 months</option>
            </select>
          </div>
        </div>
        <button type='submit' className='btn btn-primary mt-3'>
          Register
        </button>
      </form>
    </div>
  );
};

export default Signup;
// const unlisten = navigate.listen(() => { //listen for navigation events like clicking a link to navigate to a new route thus marking the beginning of navigation
//   startLoading(); //whenever a navigation occurs, start loading is called to start the loading bar
// });

// return () => {
//   unlisten(); //ensures that the listener is removed when the component unmounts to avoid memory leaks.
// };
// }, [navigate, startLoading]);

// useEffect(() => { //this useEffect runs each time the location object changes(indicates the navigation is complete) , meaning whenever the user navigates to a new route
// finishLoading(); //finish the loading
// }, [location, finishLoading]);
// 