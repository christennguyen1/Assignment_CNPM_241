import wallpaper from "../../assets/about_wallpaper.jpg";

const InfoWall = () => {
    return (
        <div className="relative z-0">
            <img className="h-96 w-full object-cover" src={wallpaper} alt="" />
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <h1 className="text-white text-6xl font-poppins_bold">VỀ DỊCH VỤ IN ẤN SSPS</h1>
            </div>
        </div>
    );
}

export default InfoWall;