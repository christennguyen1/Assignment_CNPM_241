import { useContext, useEffect, useState, useCallback, useRef } from "react";
import { collection, getDocs, doc, setDoc, query, addDoc } from "firebase/firestore";
import { listAll, ref, getDownloadURL } from "firebase/storage";
import { fireDB, storage } from "../../../firebase/FirebaseConfig.jsx";
import Layout from "../../../components/layout/Layout";
import Loader from "../../../components/loader/Loader.jsx";
import myContext from "../../../context/myContext.jsx";
import info from "../../../assets/info.svg";
import approve from "../../../assets/approve.svg";
import reject from "../../../assets/reject.svg";
import up from "../../../assets/up.svg";
import down from "../../../assets/down.svg";
import pdf from "../../../assets/pdf.svg";
import docx from "../../../assets/doc.svg";

const PrintManage = () => {
    const context = useContext(myContext);
    const { loading, setLoading } = context;

    const [printHistory, setPrintHistory] = useState([]);
    const [filteredHistory, setFilteredHistory] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
    const [filter, setFilter] = useState('all');
    const [searchInput, setSearchInput] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
    const popupRef = useRef(null);

    const statusMap = {
        pending: {
            text: 'Đang chờ',
            color: 'text-yellow-800 bg-yellow-200'
        },
        approve: {
            text: 'Đã duyệt',
            color: 'text-green-500 bg-green-100'
        },
        reject: {
            text: 'Đã hủy',
            color: 'text-red-500 bg-red-100'
        }
    };

    const fetchPrintHistory = useCallback(async () => {
        setLoading(true);
        try {
            const q = query(collection(fireDB, 'print-order'));
            const querySnapshot = await getDocs(q);
            const history = await Promise.all(querySnapshot.docs.map(async (doc) => {
                const data = doc.data();
                const filesRef = ref(storage, `print-order/${data.uid}/${doc.id}/`);
                const filesSnapshot = await listAll(filesRef);
                const files = await Promise.all(filesSnapshot.items.map(async (item) => {
                    const url = await getDownloadURL(item);
                    const fileName = item.name;
                    return { url, fileName };
                }));
                return { id: doc.id, ...data, files };
            }));
            history.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
            setPrintHistory(history);
            setFilteredHistory(history);
        } catch (error) {
            console.error('Lỗi khi tải lịch sử in:', error);
        } finally {
            setLoading(false);
        }
    }, [setLoading]);

    useEffect(() => {
        void fetchPrintHistory();
    }, [fetchPrintHistory]);

    useEffect(() => {
        let filtered = printHistory;
        if (filter !== 'all') {
            filtered = filtered.filter(order => order.status === filter);
        }
        if (searchInput) {
            filtered = filtered.filter(order =>
                order.id.includes(searchInput) ||
                order.uid.includes(searchInput) ||
                order.printer.includes(searchInput) ||
                order.files.some(file => file.fileName.includes(searchInput))
            );
        }
        setFilteredHistory(filtered);
    }, [filter, searchInput, printHistory]);

    const addNotification = async (userId, message) => {
        try {
            await addDoc(collection(fireDB, 'notification'), {
                userId,
                message,
                createdAt: new Date(),
                read: false
            });
        } catch (error) {
            console.log("Lỗi khi thêm thông báo:", error);
        }
    };

    const handleApprove = async (orderId, userId) => {
        setLoading(true);
        try {
            const orderRef = doc(fireDB, 'print-order', orderId);
            await setDoc(orderRef, { status: 'approve' }, { merge: true });
            await addNotification(userId, 'Đơn hàng của bạn đã được duyệt.');
            await fetchPrintHistory();
        } catch (error) {
            console.log('Lỗi khi duyệt đơn hàng:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async (orderId, userId) => {
        setLoading(true);
        try {
            const orderRef = doc(fireDB, 'print-order', orderId);
            await setDoc(orderRef, { status: 'reject' }, { merge: true });
            await addNotification(userId, 'Đơn hàng của bạn đã bị hủy.');
            await fetchPrintHistory();
        } catch (error) {
            console.error('Error rejecting order:', error);
        } finally {
            setLoading(false);
        }
    };

    const getFileIcon = (fileName) => {
        const extension = fileName.split('.').pop();
        if (extension === 'pdf') {
            return pdf;
        } else if (['doc', 'docx'].includes(extension)) {
            return docx;
        }
        return null;
    };

    const handleInfoClick = (order, event) => {
        const rect = event.target.getBoundingClientRect();
        setPopupPosition({ top: rect.top + window.scrollY, left: rect.right + window.scrollX });
        setSelectedOrder(order);
    };

    const closeModal = () => {
        setSelectedOrder(null);
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

    useEffect(() => {
        let filtered = printHistory;
        if (filter !== 'all') {
            filtered = filtered.filter(order => order.status === filter);
        }
        if (searchInput) {
            filtered = filtered.filter(order =>
                order.id.includes(searchInput) ||
                order.uid.includes(searchInput) ||
                order.printer.includes(searchInput) ||
                order.size.toUpperCase().includes(searchInput.toUpperCase()) ||
                order.copies.toString().includes(searchInput) ||
                order.location.toUpperCase().includes(searchInput.toUpperCase()) ||
                order.totalPrice.toString().includes(searchInput) ||
                order.totalPages.toString().includes(searchInput) ||
                order.customLocation?.toUpperCase().includes(searchInput.toUpperCase()) ||
                order.createdAt.toDate().toLocaleString('vi-VN', { hour12: false }).includes(searchInput) ||
                order.files.some(file => file.fileName.includes(searchInput))
            );
        }
        setFilteredHistory(filtered);
    }, [filter, searchInput, printHistory]);

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

    const sortedHistory = [...filteredHistory].sort((a, b) => {
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

    return (
        <Layout>
            <div className="relative">
                {loading && <Loader />}
                <div className="rounded-t-xl top-0 py-5 px-10 bg-white z-5">
                    <h2 className="text-2xl font-poppins_bold">Quản lý yêu cầu in</h2>
                    <div className="flex space-x-4 mt-4 justify-between">
                        <div className="flex space-x-4">
                            <button
                                onClick={() => toggleFilter('pending')}
                                className={`py-2 px-4 rounded-full ${filter === 'pending' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-800'}`}
                            >
                                Đang chờ
                            </button>
                            <button
                                onClick={() => toggleFilter('approve')}
                                className={`py-2 px-4 rounded-full ${filter === 'approve' ? 'bg-green-100 text-green-500' : 'bg-gray-200 text-gray-800'}`}
                            >
                                Đã duyệt
                            </button>
                            <button
                                onClick={() => toggleFilter('reject')}
                                className={`py-2 px-4 rounded-full ${filter === 'reject' ? 'bg-red-100 text-red-500' : 'bg-gray-200 text-gray-800'}`}
                            >
                                Đã hủy
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
                            <button className="col-span-1" disabled></button>
                            <button className="col-span-2 cursor-pointer select-none text-left"
                                    onClick={() => handleSort('createdAt')}>
                                Ngày tạo {getSortArrow('createdAt')}
                            </button>
                            <button className="col-span-2 text-center cursor-pointer select-none"
                                    onClick={() => handleSort('size')}>
                                Kích cỡ {getSortArrow('size')}
                            </button>
                            <button className="col-span-2 text-center cursor-pointer select-none"
                                    onClick={() => handleSort('copies')}>
                                Số bản {getSortArrow('copies')}
                            </button>
                            <button className="col-span-2 text-center cursor-pointer select-none"
                                    onClick={() => handleSort('sides')}>
                                Số mặt {getSortArrow('sides')}
                            </button>
                            <button className="col-span-3 cursor-pointer select-none"
                                    onClick={() => handleSort('location')}>
                                Địa điểm {getSortArrow('location')}
                            </button>
                            <button className="col-span-2 text-center cursor-pointer select-none"
                                    onClick={() => handleSort('printer')}>
                                Mã máy in {getSortArrow('printer')}
                            </button>
                            <button className="col-span-2 text-center cursor-pointer select-none"
                                    onClick={() => handleSort('totalPages')}>
                                Tổng trang {getSortArrow('totalPages')}
                            </button>
                            <button className="col-span-2 text-center cursor-pointer select-none"
                                    onClick={() => handleSort('totalPrice')}>
                                Tổng giá {getSortArrow('totalPrice')}
                            </button>
                            <button className="col-span-4 text-center cursor-pointer select-none"
                                    onClick={() => handleSort('files')}>
                                Tập tin {getSortArrow('files')}
                            </button>
                            <button className="col-span-2 text-center cursor-pointer select-none"
                                    onClick={() => handleSort('status')}>
                                Trạng thái {getSortArrow('status')}
                            </button>
                        </li>
                        {sortedHistory.map((order) => (
                            <li key={order.id}
                                className="col-span-24 grid grid-cols-24 gap-4 py-2 pb-5 px-4 border-b border-gray-250">
                            <span className="col-span-1 flex justify-center">
                                <button
                                    className="w-6 h-6 cursor-pointer"
                                    onClick={(e) => handleInfoClick(order, e)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            handleInfoClick(order, e);
                                        }
                                    }}
                                >
                                    <img src={info} alt="info icon" className="w-6 h-6"/>
                                </button>
                            </span>
                                <span
                                    className="col-span-2">{order.createdAt.toDate().toLocaleString('vi-VN', {hour12: false})}</span>
                                <span className="col-span-2 text-center">{order.size.toUpperCase()}</span>
                                <span className="col-span-2 text-center">{order.copies}</span>
                                <span className="col-span-2 text-center">{order.sides}</span>
                                <span className="col-span-3">
                                {order.location === 'custom' ? `${order.customLocation} (Ship tận nơi)` : order.location.toUpperCase()}
                            </span>
                                <span className="col-span-2 text-center">{order.printer}</span>
                                <span className="col-span-2 text-center">{order.totalPages}</span>
                                <span className="col-span-2 text-center">{order.totalPrice} VND</span>
                                <span className="col-span-4">
                                <ul className="w-full">
                                    {order.files?.map((file) => (
                                        <li key={file.fileName}
                                            className="font-poppins_semibold flex items-center truncate w-full">
                                            <img src={getFileIcon(file.fileName)} alt="file icon"
                                                 className="w-4 h-4 mr-1"/>
                                            <a href={file.url} target="_blank" rel="noopener noreferrer"
                                               className="truncate w-full">
                                                {file.fileName}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </span>
                                <span className="col-span-2 flex flex-col items-center">
                                <p className={`whitespace-nowrap font-poppins_semibold px-2 py-1 rounded-full ${statusMap[order.status]?.color}`}>
                                    {statusMap[order.status]?.text || order.status}
                                </p>
                                    {order.status === 'pending' && (
                                        <div className="flex space-x-2 mt-3">
                                            <button onClick={() => handleApprove(order.id, order.uid)}
                                                    className="flex items-center justify-center">
                                                <img src={approve} alt="approve icon" className="w-7 h-7"/>
                                            </button>
                                            <button onClick={() => handleReject(order.id, order.uid)}
                                                    className="flex items-center justify-center">
                                                <img src={reject} alt="reject icon" className="w-7 h-7"/>
                                            </button>
                                        </div>
                                    )}
                            </span>
                            </li>
                        ))}
                    </ul>
                    {selectedOrder && (
                        <div ref={popupRef} className="absolute bg-white p-4 border-gray-500 rounded-xl shadow"
                             style={{top: popupPosition.top - 55, left: popupPosition.left}}>
                            <p className=""><strong>Mã đơn đặt in:</strong> {selectedOrder.oid}</p>
                            <p className=""><strong>Mã người dùng:</strong> {selectedOrder.uid}</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default PrintManage;