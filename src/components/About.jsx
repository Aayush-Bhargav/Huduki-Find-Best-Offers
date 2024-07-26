import React from 'react'

const About = () => {
    return (
        <>
            <div className='container mt-2'>
                <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-4 text-center">About Huduki</h1>
            </div>
            <div class="container col-xxl-8 px-4 pt-lg-5 pb-lg-5">
                <div class="row flex-lg-row-reverse align-items-center g-5 py-5">
                    <div class="col-10 col-sm-8 col-lg-6">
                        <img src="/logos/background4.jpg" class="d-block mx-lg-auto img-fluid" alt="Bar Photograph" width="700" height="500" loading="lazy" />
                    </div>
                    <div class="col-lg-6">
                        <h3 class="display-5 fw-bold text-body-emphasis lh-1 mb-4">Discover the Best Offers</h3>
                        <p class="lead">Huduki is your go-to app for finding amazing offers at bars, pubs, and restaurants near you. Explore trending deals and exclusive discounts to make your outings more enjoyable and affordable.</p>   
                    </div>
                </div>
            </div>
            <div class="container col-xxl-8 px-4 pb-5">
                <div class="row flex-lg-row-reverse align-items-center g-5 pb-5 pt-lg-5">
                    <div class="col-10 col-sm-8 col-lg-6">
                        <img src="/logos/background3.jpg" class="d-block mx-lg-auto img-fluid" alt="Bootstrap Themes" width="700" height="500" loading="lazy" />
                    </div>
                    <div class="col-lg-6">
                        <h3 class="display-5 fw-bold text-body-emphasis lh-1 mb-4">Seamless Experience</h3>
                        <p class="lead">With Huduki, easily search offers by location, view detailed restaurant information, and generate coupons for additional savings. Join us and start discovering the best places to enjoy your time out.</p>
                       
                    </div>
                </div>
            </div>

        </>
    )
}
export default About;