import React from 'react';
import "../Footer.css"
const Footer=()=>{
    const date=new Date();
    const year=date.getFullYear();
    return(
        <footer className='open-sans-bold'><p >Copyright &copy; {year}. All Rights Reserved</p></footer>
    )
};
export default Footer;