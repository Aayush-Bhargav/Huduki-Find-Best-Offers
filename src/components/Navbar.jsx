import React from 'react'
import "../Navbar.css"
import { NavLink } from 'react-router-dom';
import { UilSearch } from '@iconscout/react-unicons';
import { UilUser } from '@iconscout/react-unicons';
import HomeIcon from '@mui/icons-material/Home';
import GroupsIcon from '@mui/icons-material/Groups';
import EditIcon from '@mui/icons-material/Edit';
import DiscountIcon from '@mui/icons-material/Discount';


const Navbar = (props) => {
    return (
        <nav className="navbar navbar-expand-lg navbarStyle " style={{position:"sticky",top:"0px",zIndex:"1"}}>
            <div className="container-fluid my-1">
                <span className="navbarTitle open-sans-bold mx-2" href="#"><UilSearch />HUDUKI</span>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse mx-4" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto  mb-lg-0 navigator">
                        {!props.loggedIn &&<>
                            <li className="nav-item">
                                <NavLink className="nav-link open-sans-less-bold mx-2" style={{ color: "black", padding: "0px", margin: "8px" }} aria-current="page" to="/"><HomeIcon style={{ color: "#7e22ce", position: "relative", top: "-4px", marginRight: "3px" }} />Home</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link open-sans-less-bold mx-2" style={{ color: "black", padding: "0px", margin: "8px" }} to="/about"><GroupsIcon style={{ color: "#7e22ce", position: "relative", top: "-2px", marginRight: "4px" }} />About</NavLink>
                            </li>
                        </>}
                        {
                            props.loggedIn && !props.renew && <>
                                <li className="nav-item">
                                    <NavLink className="nav-link open-sans-less-bold mx-2" style={{ color: "black", padding: "0px", margin: "8px" }} aria-current="page" to="/view-edit-details"><EditIcon style={{ color: "#7e22ce", position: "relative", top: "-4px", marginRight: "3px" }} />Edit Details</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link open-sans-less-bold mx-2" style={{ color: "black", padding: "0px", margin: "8px" }} to="/verify-coupon"><DiscountIcon style={{ color: "#7e22ce", position: "relative", top: "-2px", marginRight: "4px" }} />Verify Coupon</NavLink>
                                </li>
                            </>
                        }
                    </ul>
                    <div className='login-signup-holder'>
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            {!props.loggedIn ? <><li >
                                <NavLink to="/login"><button className='mx-lg-2 mx-md-0 my-2 open-sans-less-bold buttonStyle'><UilUser></UilUser>Login</button></NavLink>
                            </li>
                                <li>
                                    <NavLink to="/signup"><button className='mx-lg-2 mx-md-0 my-2 buttonStyle open-sans-less-bold'><UilUser></UilUser>Sign Up</button></NavLink>
                                </li></> : <><li >
                                    <NavLink to="/"><button className='mx-lg-2 mx-md-0 my-2 open-sans-less-bold buttonStyle' onClick={() => {
                                        localStorage.removeItem('token');
                                        localStorage.removeItem('tokenExpiration')
                                    }}><UilUser></UilUser>Logout</button></NavLink>
                                </li></>}

                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    )
}
export default Navbar;