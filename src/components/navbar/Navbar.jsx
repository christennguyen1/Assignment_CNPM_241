import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../searchBar/SearchBar";
import Logo from "./icon/Logo.png";

const Navbar = () => {
    // get user from localStorage
    const user = JSON.parse(localStorage.getItem('users'));

    // navigate
    const navigate = useNavigate();

    // logout function
    const logout = () => {
        localStorage.clear('users');
        navigate("/log-in")
    }

    // navList Data
    const navList = (
        <ul className="flex space-x-3 font-medium text-md px-5 ">
            {/* HOME */}
            <li>
                <Link to={'/'}>
                    <div className="flex items-center font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                             stroke="currentColor" className="w-6 h-6 ml-6 mr-3">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/></svg>
                        TRANG CHỦ
                    </div>
                </Link>
            </li>

            {/* PRINT REQUEST */}
            {user?.role === "user" && (
                <li>
                    <Link to={'/print-request'}>
                        <div className="flex items-center font-bold">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                                 stroke="currentColor" className="w-6 h-6 ml-6 mr-3">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"/>
                            </svg>
                            ĐẶT IN
                        </div>
                    </Link>
                </li>
            )}

            {/* E-LEARNING */}
            {user?.role === "user" && (
                <li>
                    <a href="https://lms.hcmut.edu.vn/" target="_blank" rel="noopener noreferrer">
                        <div className="flex items-center font-bold">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                                 stroke="currentColor" className="w-6 h-6 ml-6 mr-3">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"/>
                            </svg>
                            E-LEARNING
                        </div>
                    </a>
                </li>
            )}

            {/* ERROR REPORT */}
            {user?.role === "user" && (
                <li>
                    <Link to={'/error-report'}>
                        <div className="flex items-center font-bold">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                                 stroke="currentColor" className="w-6 h-6 ml-6 mr-3">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0 1 12 12.75Zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 0 1-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 0 0 2.248-2.354M12 12.75a2.25 2.25 0 0 1-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 0 0-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 0 1 .4-2.253M12 8.25a2.25 2.25 0 0 0-2.248 2.146M12 8.25a2.25 2.25 0 0 1 2.248 2.146M8.683 5a6.032 6.032 0 0 1-1.155-1.002c.07-.63.27-1.222.574-1.747m.581 2.749A3.75 3.75 0 0 1 15.318 5m0 0c.427-.283.815-.62 1.155-.999a4.471 4.471 0 0 0-.575-1.752M4.921 6a24.048 24.048 0 0 0-.392 3.314c1.668.546 3.416.914 5.223 1.082M19.08 6c.205 1.08.337 2.187.392 3.314a23.882 23.882 0 0 1-5.223 1.082"/>
                            </svg>
                            BÁO LỖI
                        </div>
                    </Link>
                </li>
            )}

            {/* PRINT MANAGEMENT */}
            {user?.role === "admin" && (
                <li>
                    <Link to={'/print-manage'}>
                        <div className="flex items-center font-bold">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                                 stroke="currentColor" className="w-6 h-6 ml-6 mr-3">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"/>
                            </svg>
                            QUẢN LÝ IN ẤN
                        </div>
                    </Link>
                </li>
            )}

            {/* ERROR MANAGEMENT */}
            {user?.role === "admin" && (
                <li>
                    <Link to={'/error-manage'}>
                        <div className="flex items-center font-bold">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                                 stroke="currentColor" className="w-6 h-6 ml-6 mr-3">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0 1 12 12.75Zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 0 1-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 0 0 2.248-2.354M12 12.75a2.25 2.25 0 0 1-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 0 0-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 0 1 .4-2.253M12 8.25a2.25 2.25 0 0 0-2.248 2.146M12 8.25a2.25 2.25 0 0 1 2.248 2.146M8.683 5a6.032 6.032 0 0 1-1.155-1.002c.07-.63.27-1.222.574-1.747m.581 2.749A3.75 3.75 0 0 1 15.318 5m0 0c.427-.283.815-.62 1.155-.999a4.471 4.471 0 0 0-.575-1.752M4.921 6a24.048 24.048 0 0 0-.392 3.314c1.668.546 3.416.914 5.223 1.082M19.08 6c.205 1.08.337 2.187.392 3.314a23.882 23.882 0 0 1-5.223 1.082"/>
                            </svg>
                            QUẢN LÝ LỖI
                        </div>
                    </Link>
                </li>
            )}

            {/* INTRODUCTION */}
            <li>
                <Link to={'/about-us'}>
                    <div className="flex items-center font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                             stroke="currentColor" className="w-6 h-6 ml-6 mr-3">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"/>
                        </svg>
                        GIỚI THIỆU
                    </div>
                </Link>
            </li>
        </ul>
    )
    return (
        <>
            {/* STATIC NAVIGATION BAR */}
            <div className="flex sticky z-10 bg-white justify-between items-center py-2">
                {/* LEFT*/}
                <div className="left flex items-center">
                    <Link to={'/'}>
                        <img src={Logo} alt="Logo" className="ml-32 w-11"/>
                    </Link>
                </div>

                {/* CENTER  */}
                <div className="center flex justify-center">
                    <SearchBar/>
                </div>

                {/* RIGHT  */}
                <div className="right flex justify-center">
                    {/* LOG IN */}
                    {!user ?
                        <div className="flex items-center ml-6">
                            <Link to={'/log-in'}
                                  className="bg-black text-white rounded-lg px-3 py-1 border-2 border-black hover:bg-gray-800">Đăng
                                nhập</Link>
                        </div>
                        : ""}

                    {/* SIGN UP */}
                    {!user ?
                        <div className="flex items-center ml-6 mr-6">
                            <Link to={'/sign-up'}
                                  className="rounded-lg px-3 py-1 border-2 border-black hover:bg-gray-300">Đăng
                                ký</Link>
                        </div>
                        : ""}

                    {/* USER */}
                    {user?.role === "user" && <div className="flex items-center">
                        <Link to={'/user-dashboard'}>
                            <span className="flex bg-black rounded-full py-1.5 px-1.5 text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="1.5"
                                     stroke="currentColor" className="w-6 h-6 mr-0">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/>
                                </svg>
                            </span>
                        </Link>
                    </div>}

                    {/* Admin */}
                    {user?.role === "admin" && <div className="flex items-center">
                        <Link to={'/admin-dashboard'}>
                            <span className="flex bg-black rounded-full py-1.5 px-1.5 text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="1.5"
                                     stroke="currentColor" className="w-6 h-6 mr-0">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"/>
                                </svg>
                            </span>
                        </Link>
                    </div>}

                    {/* LOG OUT */}
                    {user &&
                        <button
                            className="ml-6 mr-6 px-3 flex rounded-lg py-1 border-2 border-black hover:bg-gray-300 cursor-pointer"
                            onClick={logout}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') logout();
                            }}
                            onTouchStart={logout}
                            onMouseDown={(e) => e.preventDefault()}>
                            Đăng xuất
                        </button>}
                </div>
            </div>

            {/* DYNAMIC NAVIGATION BAR */}
            <nav className="bg-black sticky z-10 top-0 py-5">
                <div className="right flex justify-center mb-4 lg:mb-0 text-white">
                    {navList}
                </div>
            </nav>
        </>
    );
}

export default Navbar;