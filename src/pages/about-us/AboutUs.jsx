import Layout from "../../components/layout/Layout";
import Track from "../../components/track/Track.jsx";
import Testimonial from "../../components/testimonial/Testimonial.jsx";
import InfoWall from "../../components/info-wall/InfoWall.jsx";

const AboutUs = () => {
    return (
        <Layout>
            <InfoWall/>
            <Track/>
            <Testimonial/>
        </Layout>
    );
}

export default AboutUs;