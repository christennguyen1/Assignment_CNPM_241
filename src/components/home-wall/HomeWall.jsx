import { useNavigate } from "react-router";
import wallpaper from "../../assets/home_wallpaper.jpg";

const HomeWall = () => {
    const user = JSON.parse(localStorage.getItem('users'));
    const navigate = useNavigate();

    const handleStartClick = () => {
        if (user?.role === 'admin') {
            navigate('/print-manage');
        } else {
            navigate('/print-request');
        }
    };

    return (
        <div className="relative z-0 w-full h-screen">
            <img className="absolute top-0 left-0 w-full h-full object-cover" src={wallpaper} alt="" />
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60"></div>
            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center space-y-4">
                <h1 className="text-white mt-10 text-6xl font-poppins_bold">HCMUT - SSPS</h1>
                <p className="text-white text-center pt-12 px-4 max-w-2xl">
                    Chào mừng đến với dịch vụ in ấn HCMUT - SSPS. Chúng tôi cung cấp các giải pháp in ấn chất lượng cao cho mọi nhu cầu của bạn. Khám phá các dịch vụ của chúng tôi và bắt đầu trải nghiệm yêu cầu in ấn của bạn ngay hôm nay!
                </p>
                <div className="flex justify-center pt-12 space-x-4">
                    <button
                        onClick={handleStartClick}
                        className="bg-white hover:bg-gray-300 py-2 font-poppins_semibold px-6 rounded-full shadow-lg transform transition-transform hover:scale-105"
                    >
                        Bắt đầu
                    </button>
                    <button
                        onClick={() => navigate('/about-us')}
                        className="text-white font-poppins_semibold py-2 px-6 transform transition-transform hover:scale-105 flex items-center space-x-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                        </svg>
                        <span>Về dịch vụ</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HomeWall;