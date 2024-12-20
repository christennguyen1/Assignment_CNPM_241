import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Logo from "../../assets/logo.svg";

const Navbar = () => {
    const user = JSON.parse(localStorage.getItem('users'));
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userColor, setUserColor] = useState('');
    const [textColor, setTextColor] = useState('');

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
                <Link to={'/'}>
                    <div className="flex items-center">
                        Home
                    </div>
                </Link>
            </li>
            {user?.role === "user" && (
                <>
                    <li>
                        <Link to={'/print-request'}>
                            <div className="flex items-center">
                                Print
                            </div>
                        </Link>
                    </li>
                    <li>
                        <a href="https://lms.hcmut.edu.vn/" target="_blank" rel="noopener noreferrer">
                            <div className="flex items-center">
                                E-learning
                            </div>
                        </a>
                    </li>
                    <li>
                        <Link to={'/error-report'}>
                            <div className="flex items-center">
                                Bug
                            </div>
                        </Link>
                    </li>
                </>
            )}
            {user?.role === "admin" && (
                <>
                    <li>
                        <Link to={'/print-manage'}>
                            <div className="flex items-center">
                                Print
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link to={'/error-manage'}>
                            <div className="flex items-center">
                                Bug
                            </div>
                        </Link>
                    </li>
                </>
            )}
            <li>
                <Link to={'/about-us'}>
                    <div className="font-poppins flex items-center">
                        About
                    </div>
                </Link>
            </li>
        </ul>
    );

    return (
        <div className="flex sticky z-10 bg-white justify-between items-center shadow px-10">
            <div className="w-20 h-20">
                <Link to={'/'}>
                    <img src={Logo} alt="Logo" className="pt-1 w-20 h-20"/>
                </Link>
            </div>
            <div className="center flex justify-center">
                {navList}
            </div>
            <div className="right flex justify-center relative">
                {!user ? (
                    <Link to={'/log-in'}
                          className="font-poppins font-medium text-[17px]">Log
                        in</Link>
                ) : (
                    <div className="flex items-center">
                        <div className="relative">
                            <button onClick={toggleDropdown} className="flex items-center justify-center rounded-full py-1.5 px-1.5 text-white font-poppins_light font-bold" style={{ backgroundColor: userColor, color: textColor, width: '40px', height: '40px' }}>
                                {getInitials(user.name)}
                            </button>
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg  font-poppins font-medium">
                                    <Link to={user?.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'} className="block hover:bg-gray-100 px-5 py-3">
                                        Profile
                                    </Link>
                                    <button onClick={logout} className="block  hover:bg-gray-100 w-full text-left px-5 py-3">Log out</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;