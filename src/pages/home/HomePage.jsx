import HomeWall from "../../components/home-wall/HomeWall";
import Layout from "../../components/layout/Layout";
import { useNavigate } from "react-router";

const HomePage = () => {
    return (
        <Layout>
            <HomeWall/>
        </Layout>
    );
}

export default HomePage;