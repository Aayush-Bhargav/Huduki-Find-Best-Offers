import React from 'react'

const About = () => {
    return (
        <>




            <div className="px-4 pt-2 mt-2 mb-5 text-center ">
                <h1 className="display-4 fw-bold text-body-emphasis mb-4">About Huduki</h1>
                <div className="overflow-hidden mb-5" style={{ maxHeight: "30vh" }} >
                    <div className="container px-5">
                        <img src="/logos/background2.avif" className="img-fluid border rounded-3 shadow-lg mb-4" alt="Example Photograph" width="700" height="500" loading="lazy" />
                    </div>
                </div>
                <div className="col-lg-6 mx-auto">
                    <p className="lead mb-5">Welcome to Huduki, your ultimate companion for discovering the best offers and discounts at pubs, restaurants, and bars near you. Our mission is to help you save money while enjoying unforgettable dining and social experiences. With Huduki, you can effortlessly enter your location and find the nearest establishments with the most enticing deals.</p>
                    <p className="lead mb-5">Whether you’re looking for a cozy pub, a trendy restaurant, or a lively bar, Huduki makes it easy to explore a variety of options that suit your preferences and budget. Additionally, you can view detailed information about each venue, including their location and special offers, ensuring you have all the information you need to make the best choice. Join us on this exciting journey to discover great deals and elevate your dining and social experiences with Huduki.</p>
                </div>

            </div>

        </>
    )
}
export default About;