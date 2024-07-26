import React from 'react';
import "../Footer.css"
const Footer = () => {
    const date = new Date();
    const year = date.getFullYear();
    return (
        <>
            <div className="container px-lg-4">
                <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 px-lg-4">
                    <div className="col-md-8 col-sm-12 d-flex  social">
                        <span className="mb-3 mb-md-0 px-lg-3" style={{fontSize:"17px"}}>Copyright &copy; {year}. All Rights Reserved.</span>
                    </div>

                    <div className="social" style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <a href="https://www.facebook.com/huduki" aria-label="facebook" target="_blank" rel="noreferrer" className="text-gray-500 dark:text-gray-300 mx-2"><svg fill="currentColor" height="1rem" width="1rem" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>
                        </a>
                        <a href="https://www.twitter.com/huduki" height="1rem" width="1rem" aria-label="twitter" target="_blank" rel="noreferrer" className="mx-2 text-gray-500 dark:text-gray-300"><svg fill="currentColor" height="1rem" width="1rem" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg>
                        </a>
                        <a href="https://www.instagram.com/huduki" aria-label="instagram" target="_blank" rel="noreferrer" className="mx-2 text-gray-500 dark:text-gray-300"><svg fill="none" height="1rem" width="1rem" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path></svg>
                        </a>
                    </div>
                </footer>
            </div>
        </>

    )
};
export default Footer;