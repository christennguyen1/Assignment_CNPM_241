import { useContext, useEffect, useState, useCallback, useRef } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { listAll, ref, getDownloadURL } from "firebase/storage";
import { fireDB, storage } from "../../../firebase/FirebaseConfig.jsx";
import Layout from "../../../components/layout/Layout";
import Loader from "../../../components/loader/Loader.jsx";
import myContext from "../../../context/myContext.jsx";
import info from "../../../assets/info.svg";

const Feedback = () => {
    const context = useContext(myContext);
    const { loading, setLoading } = context;

    const [feedbackHistory, setFeedbackHistory] = useState([]);
    const [filteredHistory, setFilteredHistory] = useState([]);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
    const [filter, setFilter] = useState('all');
    const [searchInput, setSearchInput] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });
    const popupRef = useRef(null);

    const fetchFeedbackHistory = useCallback(async () => {
        setLoading(true);
        try {
            const q = query(collection(fireDB, 'feedback'));
            const querySnapshot = await getDocs(q);
            const history = await Promise.all(querySnapshot.docs.map(async (doc) => {
                const data = doc.data();
                const filesRef = ref(storage, `feedback/${doc.id}/`);
                const filesSnapshot = await listAll(filesRef);
                const files = await Promise.all(filesSnapshot.items.map(async (item) => {
                    const url = await getDownloadURL(item);
                    const fileName = item.name;
                    return { url, fileName };
                }));
                return { id: doc.id, ...data, files };
            }));
            history.sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate());
            setFeedbackHistory(history);
            setFilteredHistory(history);
        } catch (error) {
            console.error('Lỗi khi tải lịch sử phản hồi:', error);
        } finally {
            setLoading(false);
        }
    }, [setLoading]);

    useEffect(() => {
        void fetchFeedbackHistory();
    }, [fetchFeedbackHistory]);

    useEffect(() => {
        let filtered = feedbackHistory;
        if (filter !== 'all') {
            filtered = filtered.filter(feedback => feedback.type === filter);
        }
        if (searchInput) {
            filtered = filtered.filter(feedback =>
                feedback.id.includes(searchInput) ||
                feedback.uid.includes(searchInput) ||
                feedback.title.includes(searchInput) ||
                feedback.description.includes(searchInput) ||
                feedback.type.includes(searchInput) ||
                feedback.files.some(file => file.fileName.includes(searchInput))
            );
        }
        setFilteredHistory(filtered);
    }, [filter, searchInput, feedbackHistory]);

    const handleInfoClick = (feedback, event) => {
        const rect = event.target.getBoundingClientRect();
        setPopupPosition({ top: rect.top + window.scrollY, left: rect.right + window.scrollX });
        setSelectedFeedback(feedback);
    };

    const closeModal = () => {
        setSelectedFeedback(null);
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
        let filtered = feedbackHistory;
        if (filter !== 'all') {
            filtered = filtered.filter(feedback => feedback.type === filter);
        }
        if (searchInput) {
            filtered = filtered.filter(feedback =>
                feedback.id.includes(searchInput) ||
                feedback.uid.includes(searchInput) ||
                feedback.title.includes(searchInput) ||
                feedback.description.includes(searchInput) ||
                feedback.type.includes(searchInput) ||
                feedback.files.some(file => file.fileName.includes(searchInput))
            );
        }
        setFilteredHistory(filtered);
    }, [filter, searchInput, feedbackHistory]);

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

    const getEmotionClass = (emotion) => {
        switch (emotion) {
            case 'love':
                return 'text-green-500 bg-green-100';
            case 'like':
                return 'text-yellow-800 bg-yellow-200'
            case 'neutral':
                return 'text-gray-500 bg-gray-100';
            case 'dislike':
                return 'text-orange-500 bg-orange-100';
            case 'hate':
                return 'text-red-500 bg-red-100';
            default:
                return '';
        }
    };

    const getEmotionText = (emotion) => {
        switch (emotion) {
            case 'love':
                return 'Rất hài lòng';
            case 'like':
                return 'Hài lòng';
            case 'neutral':
                return 'Bình thường';
            case 'dislike':
                return 'Thất vọng';
            case 'hate':
                return 'Rất thất vọng';
            default:
                return '';
        }
    };

    return (
        <Layout>
            <div className="relative">
                {loading && <Loader />}
                <div className="rounded-t-xl top-0 py-5 px-10 bg-white z-5">
                    <h2 className="text-2xl font-poppins_bold">Quản lý phản hồi người dùng</h2>
                    <div className="flex space-x-4 mt-4 justify-between">
                        <div className="flex space-x-4">
                            <button
                                onClick={() => toggleFilter('report')}
                                className={`py-2 px-4 rounded-full ${filter === 'report' ? 'bg-red-100 text-red-500' : 'bg-gray-200 text-gray-800'}`}
                            >
                                Báo lỗi
                            </button>
                            <button
                                onClick={() => toggleFilter('feedback')}
                                className={`py-2 px-4 rounded-full ${filter === 'feedback' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-800'}`}
                            >
                                Đánh giá
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
                            <button className="col-span-2 select-none text-left"
                                    onClick={() => handleSort('timestamp')}>
                                Ngày tạo
                            </button>
                            <button className="col-span-2 select-none text-center"
                                    onClick={() => handleSort('type')}>
                                Loại
                            </button>
                            <button className="col-span-5 select-none text-center"
                                    onClick={() => handleSort('title')}>
                                Tiêu đề
                            </button>
                            <button className="col-span-8 select-none text-center"
                                    onClick={() => handleSort('description')}>
                                Mô tả
                            </button>
                            <button className="col-span-3 select-none text-center"
                                    onClick={() => handleSort('printer')}>
                                Mã máy in
                            </button>
                            <button className="col-span-3 select-none text-center"
                                    onClick={() => handleSort('emotion')}>
                                Độ hài lòng
                            </button>
                        </li>
                        {sortedHistory.map((feedback) => (
                            <li key={feedback.id}
                                className="col-span-24 grid grid-cols-24 gap-4 py-2 pb-5 px-4 border-b border-gray-250">
                            <span className="col-span-1 flex justify-center">
                                <button
                                    className="w-6 h-6 cursor-pointer"
                                    onClick={(e) => handleInfoClick(feedback, e)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            handleInfoClick(feedback, e);
                                        }
                                    }}
                                >
                                    <img src={info} alt="info icon" className="w-6 h-6"/>
                                </button>
                                </span>
                                <span
                                    className="col-span-2">{feedback.timestamp.toDate().toLocaleString('vi-VN', {hour12: false})}</span>
                                <span
                                    className="col-span-2 text-center">{feedback.type === 'report' ? 'Báo lỗi' : 'Đánh giá'}</span>
                                <span
                                    className="col-span-5 break-words overflow-hidden">{feedback.title}</span>
                                <span className="col-span-8 break-words overflow-hidden">{feedback.description}</span>
                                <span className="col-span-3 break-words text-center">{feedback.printer}</span>
                                <span className="col-span-3 text-center inline-flex items-center justify-center">
                                    <span
                                        className={`font-poppins_bold inline-block rounded-full px-2 py-1 ${getEmotionClass(feedback.emotion)}`}>
                                        {getEmotionText(feedback.emotion)}
                                    </span>
                                </span>
                            </li>
                        ))}
                    </ul>
                    {selectedFeedback && (
                        <div ref={popupRef} className="absolute bg-white p-4 border-gray-500 rounded-xl shadow"
                             style={{top: popupPosition.top - 55, left: popupPosition.left}}>
                            <p className=""><strong>Mã phản hồi</strong> {selectedFeedback.fid}</p>
                            <p className=""><strong>Mã người dùng:</strong> {selectedFeedback.uid}</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Feedback;