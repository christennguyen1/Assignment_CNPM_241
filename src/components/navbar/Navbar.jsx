import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import logo from "../../assets/logo.svg";
import logo_white from "../../assets/logo_white.svg";
import notification from "../../assets/notification.svg";
import notification_white from "../../assets/notification_white.svg";
import NotificationPopup from './NotificationPopup';

const Navbar = () => {
    const user = JSON.parse(localStorage.getItem('users'));
    const navigate = useNavigate();
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userColor, setUserColor] = useState('');
    const [textColor, setTextColor] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const dropdownRef = useRef(null);

    const [showNotifications, setShowNotifications] = useState(false);

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    useEffect(() => {
        if (user) {
            const storedColor = localStorage.getItem(`userColor_${user.name}`);
            if (storedColor) {
                setUserColor(storedColor);
                setTextColor(getContrastingColor(storedColor));
            } else {
                const newColor = generateLightColor();
                localStorage.setItem(`userColor_${user.name}`, newColor);
                setUserColor(newColor);
                setTextColor(getContrastingColor(newColor));
            }
        }
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const generateLightColor = () => {
        const letters = 'BCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * letters.length)];
        }
        return color;
    };

    const getContrastingColor = (color) => {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        const yiq = (r * 299 + g * 587 + b * 114) / 1000;
        return yiq >= 128 ? '#000000' : '#FFFFFF';
    };

    const logout = () => {
        localStorage.clear('users');
        navigate("/log-in");
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const getInitials = (name) => {
        if (!name) return '';
        const initials = name.split(' ').map(word => word[0]).join('').toUpperCase();
        return initials.length > 2 ? initials.slice(0, 2) : initials;
    };

    const navList = (
        <ul className="font-poppins font-medium text-[17px] space-x-16 flex">
            <li>
                <Link to={'/about-us'}>
                    <div className="font-poppins flex items-center">About</div>
                </Link>
            </li>
            {user?.role === "user" && (
                <>
                    <li>
                        <Link to={'/print-request'}>
                            <div className="flex items-center">Print</div>
                        </Link>
                    </li>
                    <li>
                        <Link to={'/feedback'}>
                            <div className="flex items-center">Feedback</div>
                        </Link>
                    </li>
                    <li>
                        <a href="https://lms.hcmut.edu.vn/" target="_blank" rel="noopener noreferrer">
                            <div className="flex items-center">E-learning</div>
                        </a>
                    </li>
                </>
            )}
            {user?.role === "admin" && (
                <>
                    <li>
                        <Link to={'/print-manage'}>
                            <div className="flex items-center">Print</div>
                        </Link>
                    </li>
                    <li>
                        <Link to={'/error-manage'}>
                            <div className="flex items-center">Feedback</div>
                        </Link>
                    </li>
                    <li>
                        <Link to={'/printer-manage'}>
                            <div className="flex items-center">Printer</div>
                        </Link>
                    </li>
                    <li>
                        <Link to={'/user-manage'}>
                            <div className="flex items-center">User</div>
                        </Link>
                    </li>
                    <li>
                        <Link to={'/analytics-manage'}>
                            <div className="flex items-center">Analytics</div>
                        </Link>
                    </li>
                </>
            )}
        </ul>
    );

    const isHomePageOrFeedback = location.pathname === '/' || location.pathname === '/feedback';
    const hoverTextColor = isHovered ? 'text-black' : 'text-white';
    const loginLinkClassName = `font-poppins font-medium text-[17px] ${isHomePageOrFeedback ? hoverTextColor : 'text-black'}`;

    return (
        <nav
            className={`flex ${isHomePageOrFeedback ? 'navbar-home' : 'top-0 z-10 bg-white text-black shadow'} justify-between items-center px-10`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="w-20 h-20">
                {isHomePageOrFeedback && (
                    <div className="w-20 h-20">
                        <Link to={'/'}>
                            <img
                                src={isHovered ? logo : logo_white}
                                alt="Logo"
                                className={`pt-1 w-20 h-20`}
                            />
                        </Link>
                    </div>
                )}
                {!isHomePageOrFeedback && (
                    <div className="w-20 h-20">
                        <Link to={'/'}>
                            <img
                                src={logo}
                                alt="Logo"
                                className={`pt-1 w-20 h-20`}
                            />
                        </Link>
                    </div>
                )}
            </div>
            <div className="center flex justify-center">{navList}</div>
            <div className="right flex justify-center relative">
                {!user ?
                    <Link
                        to={'/log-in'}
                        className={loginLinkClassName}
                    >
                        Log in
                    </Link>
                    : (
                        <div className="flex items-center">
                            <button onClick={toggleNotifications} className="relative">
                                <img
                                    src={isHomePageOrFeedback ? (isHovered ? notification : notification_white) : notification}
                                    alt="Notification"
                                    className="w-5 h-5 mt-0.5 mr-8"
                                />
                                {showNotifications && <NotificationPopup userId={user.uid} />}
                            </button>
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={toggleDropdown}
                                    className={`flex items-center justify-center rounded-full py-1.5 px-1.5 font-poppins_light font-bold ${isHomePageOrFeedback ? 'text-white' : 'text-black'}`}
                                    style={{
                                        backgroundColor: isHomePageOrFeedback && !isHovered ? 'transparent' : userColor,
                                        color: isHomePageOrFeedback && !isHovered ? 'white' : textColor,
                                        width: '40px',
                                        height: '40px'
                                    }}
                                >
                                    {getInitials(user.name)}
                                </button>
                                {dropdownOpen && isHovered && (
                                    <div
                                        className="absolute z-30 right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg font-poppins font-medium">
                                        <Link
                                            to='/dashboard'
                                            className="block hover:bg-gray-100 px-5 py-3"
                                        >
                                            Profile
                                        </Link>
                                        <button
                                            onClick={logout}
                                            className="block hover:bg-gray-100 w-full text-left px-5 py-3"
                                        >
                                            Log out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
            </div>
        </nav>
    );
};

export default Navbar;