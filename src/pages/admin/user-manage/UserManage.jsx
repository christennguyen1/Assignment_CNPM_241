import { useContext, useEffect, useState, useCallback, useRef } from "react";
import { collection, getDocs, setDoc, doc, query, getDoc } from "firebase/firestore";
import { fireDB } from "../../../firebase/FirebaseConfig.jsx";
import Layout from "../../../components/layout/Layout";
import Loader from "../../../components/loader/Loader.jsx";
import myContext from "../../../context/myContext.jsx";
import info from "../../../assets/info.svg";
import up from "../../../assets/up.svg";
import down from "../../../assets/down.svg";
import toast from "react-hot-toast";

const UserManage = () => {
    const cur = JSON.parse(localStorage.getItem('users'));

    const context = useContext(myContext);
    const { loading, setLoading } = context;

    const [userList, setUserList] = useState([]);
    const [filteredUserList, setFilteredUserList] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
    const [filter, setFilter] = useState('all');
    const [searchInput, setSearchInput] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const popupRef = useRef(null);

    const fetchUserList = useCallback(async () => {
        setLoading(true);
        try {
            const q = query(collection(fireDB, 'user'));
            const querySnapshot = await getDocs(q);
            const users = await Promise.all(querySnapshot.docs.map(async (doc) => {
                const userData = await getDoc(doc.ref);
                return { id: doc.id, ...userData.data() };
            }));
            setUserList(users);
            setFilteredUserList(users);
        } catch (error) {
            console.error('Error fetching user list:', error);
        } finally {
            setLoading(false);
        }
    }, [setLoading]);

    useEffect(() => {
        void fetchUserList();
    }, [fetchUserList]);

    useEffect(() => {
        let filtered = userList;
        if (filter === 'admin') {
            filtered = filtered.filter(user => user.role === 'admin');
        } else if (filter === 'user') {
            filtered = filtered.filter(user => user.role === 'user');
        }
        if (searchInput) {
            const lowerCaseSearchInput = searchInput.toLowerCase();
            filtered = filtered.filter(user =>
                user.name.toLowerCase().includes(lowerCaseSearchInput) ||
                user.email.toLowerCase().includes(lowerCaseSearchInput) ||
                user.role.toLowerCase().includes(lowerCaseSearchInput) ||
                user.uid.toLowerCase().includes(lowerCaseSearchInput)
            );
        }
        setFilteredUserList(filtered);
    }, [filter, searchInput, userList]);

    const handleInfoClick = (user, event) => {
        const rect = event.target.getBoundingClientRect();
        setPopupPosition({ top: rect.top + window.scrollY, left: rect.right + window.scrollX });
        setSelectedUser(user);
    };

    const closeModal = () => {
        setSelectedUser(null);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                closeModal();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [popupRef]);

    const toggleFilter = (newFilter) => {
        setFilter((prevFilter) => (prevFilter === newFilter ? 'all' : newFilter));
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedUserList = [...filteredUserList].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const getSortArrow = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? <img src={up} alt="up arrow" className="inline w-3 h-3 ml-1" /> : <img src={down} alt="down arrow" className="inline w-3 h-3 ml-1" />;
        }
        return null;
    };

    const toggleUserRole = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        try {
            // Update the user's role in Firestore
            const userRef = doc(fireDB, 'user', userId);
            await setDoc(userRef, { role: newRole }, { merge: true });

            // Update the user list state
            setUserList(prevList => prevList.map(user => user.id === userId ? { ...user, role: newRole } : user));
            setFilteredUserList(prevList => prevList.map(user => user.id === userId ? { ...user, role: newRole } : user));

            // Show a toast notification
            toast.success(`User role updated to ${newRole === 'admin' ? 'Quản trị viên' : 'Người dùng'}`);
        } catch (error) {
            console.error('Error updating user role:', error);
            toast.error('Failed to update user role');
        }
    };

    return (
        <Layout>
            <div className="relative">
                {loading && <Loader />}
                <div className="rounded-t-xl top-0 py-5 px-10 bg-white z-5">
                    <h2 className="text-2xl font-poppins_bold">Quản lý người dùng</h2>
                    <div className="flex space-x-4 mt-4 justify-between">
                        <div className="flex space-x-4">
                            <button
                                onClick={() => toggleFilter('admin')}
                                className={`py-2 px-4 rounded-full ${filter === 'admin' ? 'bg-green-100 text-green-500' : 'bg-gray-200 text-gray-800'}`}
                            >
                                Quản trị viên
                            </button>
                            <button
                                onClick={() => toggleFilter('user')}
                                className={`py-2 px-4 rounded-full ${filter === 'user' ? 'bg-blue-100 text-blue-500' : 'bg-gray-200 text-gray-800'}`}
                            >
                                Người dùng
                            </button>
                        </div>
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Tìm kiếm để lọc dữ liệu..."
                            className="py-2 pl-4 pr-10 rounded-full border border-gray-300"
                        />
                    </div>
                </div>
                <div className="border border-gray-300 rounded-2xl mx-10 mb-5">
                    <ul className="overflow-y-auto w-full">
                        <li className="col-span-24 grid grid-cols-24 gap-3 p-5 border-b border-gray-250 font-poppins_bold">
                            <span className="col-span-1"></span>
                            <button className="col-span-2 select-none text-left" onClick={() => handleSort('time')}>
                                Ngày tạo {getSortArrow('time')}
                            </button>
                            <button className="col-span-6 select-none text-left" onClick={() => handleSort('name')}>
                                Tên {getSortArrow('name')}
                            </button>
                            <button className="col-span-6 select-none text-left" onClick={() => handleSort('email')}>
                                Email {getSortArrow('email')}
                            </button>
                            <button className="col-span-2 select-none text-center" onClick={() => handleSort('a3')}>
                                A3 {getSortArrow('a3')}
                            </button>
                            <button className="col-span-2 select-none text-center" onClick={() => handleSort('a4')}>
                                A4 {getSortArrow('a4')}
                            </button>
                            <button className="col-span-2 text-center" onClick={() => handleSort('a5')}>
                                A5 {getSortArrow('a5')}
                            </button>
                            <button className="col-span-3 text-center" onClick={() => handleSort('role')}>
                                Vai trò {getSortArrow('role')}
                            </button>
                        </li>
                        {sortedUserList.map((user) => (
                            <li key={user.id}
                                className="col-span-24 grid grid-cols-24 gap-4 py-2 pb-5 px-4 border-b border-gray-250">
                                <span className="col-span-1 flex justify-center">
                                    <button
                                        className="w-6 h-6 cursor-pointer"
                                        onClick={(e) => handleInfoClick(user, e)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                handleInfoClick(user, e);
                                            }
                                        }}
                                    >
                                        <img src={info} alt="info icon" className="w-6 h-6"/>
                                    </button>
                                </span>
                                <span className="col-span-2">{user.time?.toDate().toLocaleString('vi-VN', {hour12: false})}</span>
                                <span className="col-span-6">{user.name}</span>
                                <span className="col-span-6">{user.email}</span>
                                <span className="col-span-2 text-center">{user.a3}</span>
                                <span className="col-span-2 text-center">{user.a4}</span>
                                <span className="col-span-2 text-center">{user.a5}</span>
                                <span className="col-span-3 text-center">
                                    <button
                                        className={`px-2 py-1 rounded-full font-poppins_bold cursor-pointer ${user.role === 'admin' ? 'bg-green-100 text-green-500' : 'bg-blue-100 text-blue-500'} ${user.uid === cur.uid ? 'cursor-not-allowed opacity-50' : ''}`}
                                        onClick={() => user.uid !== cur.uid && toggleUserRole(user.id, user.role)}
                                        disabled={user.uid === cur.uid}
                                    >
                                        {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                                    </button>
                                </span>
                            </li>
                        ))}
                    </ul>
                    {selectedUser && (
                        <div ref={popupRef} className="absolute bg-white p-4 border-gray-500 rounded-xl shadow"
                             style={{top: popupPosition.top - 55, left: popupPosition.left}}>
                            <p className=""><strong>Mã người dùng:</strong> {selectedUser.uid}</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default UserManage;