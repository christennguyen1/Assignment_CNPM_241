import Layout from "../../components/layout/Layout";
import Track from "../../components/track/Track.jsx";
import Testimonial from "../../components/testimonial/Testimonial.jsx";
import HeroSection from "../../components/info-wall/InfoWall.jsx";


const AboutUs = () => {
    return (
        <Layout>
            <HeroSection/>
            <Track/>
            <Testimonial/>
        </Layout>
    );
}

export default AboutUs;