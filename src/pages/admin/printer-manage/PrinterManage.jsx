import { useContext, useEffect, useState, useCallback, useRef } from "react";
import { collection, getDocs, query, setDoc, doc, where, deleteDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { fireDB } from "../../../firebase/FirebaseConfig.jsx";
import Layout from "../../../components/layout/Layout";
import Loader from "../../../components/loader/Loader.jsx";
import myContext from "../../../context/myContext.jsx";
import toast from "react-hot-toast";
import info from "../../../assets/info.svg";
import up from "../../../assets/up.svg";
import down from "../../../assets/down.svg";
import trash from "../../../assets/trash.svg";

const PrinterManage = () => {
    const context = useContext(myContext);
    const { loading, setLoading } = context;

    const [printerList, setPrinterList] = useState([]);
    const [filteredPrinterList, setFilteredPrinterList] = useState([]);
    const [selectedPrinter, setSelectedPrinter] = useState(null);
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
    const [filter, setFilter] = useState('all');
    const [searchInput, setSearchInput] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [showAddForm, setShowAddForm] = useState(false);
    const [newPrinter, setNewPrinter] = useState({ name: '', pid: '', place: '', working: true });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [printerToDelete, setPrinterToDelete] = useState(null);
    const popupRef = useRef(null);
    const addButtonRef = useRef(null);

    const fetchPrinterList = useCallback(async () => {
        setLoading(true);
        try {
            const q = query(collection(fireDB, 'printer'));
            const querySnapshot = await getDocs(q);
            const printers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPrinterList(printers);
            setFilteredPrinterList(printers);
        } catch (error) {
            console.error('Lỗi khi tải danh sách máy in:', error);
        } finally {
            setLoading(false);
        }
    }, [setLoading]);

    useEffect(() => {
        void fetchPrinterList();
    }, [fetchPrinterList]);

    useEffect(() => {
        let filtered = printerList;
        if (filter === 'working') {
            filtered = filtered.filter(printer => printer.working);
        } else if (filter === 'not-working') {
            filtered = filtered.filter(printer => !printer.working);
        }
        if (searchInput) {
            const lowerCaseSearchInput = searchInput.toLowerCase();
            filtered = filtered.filter(printer =>
                printer.name.toLowerCase().includes(lowerCaseSearchInput) ||
                printer.pid.toLowerCase().includes(lowerCaseSearchInput) ||
                printer.place.toLowerCase().includes(lowerCaseSearchInput) ||
                (printer.working && 'đang hoạt động'.includes(lowerCaseSearchInput)) ||
                (!printer.working && 'không hoạt động'.includes(lowerCaseSearchInput))
            );
        }
        setFilteredPrinterList(filtered);
    }, [filter, searchInput, printerList]);

    const handleInfoClick = (printer, event) => {
        const rect = event.target.getBoundingClientRect();
        setPopupPosition({ top: rect.top + window.scrollY, left: rect.right + window.scrollX });
        setSelectedPrinter(printer);
    };

    const closeModal = () => {
        setSelectedPrinter(null);
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

    const sortedPrinterList = [...filteredPrinterList].sort((a, b) => {
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

    const handleAddPrinter = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const q = query(collection(fireDB, 'printer'), where('pid', '==', newPrinter.pid));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                console.error('Mã máy in đã tồn tại. Vui lòng sử dụng mã khác.');
                setLoading(false);
                return;
            }

            await setDoc(doc(fireDB, 'printer', newPrinter.pid), { ...newPrinter, createdAt: serverTimestamp() });
            setNewPrinter({ name: '', pid: '', place: '', working: true });
            setShowAddForm(false);
            await fetchPrinterList();
            toast.success('Thêm máy in thành công!');
        } catch (error) {
            console.error('Lỗi khi thêm máy in:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePrinter = async (id) => {
        setLoading(true);
        try {
            await deleteDoc(doc(fireDB, 'printer', id));
            await fetchPrinterList();
            toast.success('Printer deleted successfully!');
        } catch (error) {
            console.error('Error deleting printer:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleWorking = async (id, currentStatus) => {
        setLoading(true);
        try {
            await updateDoc(doc(fireDB, 'printer', id), { working: !currentStatus });
            await fetchPrinterList();
            toast.success('Cập nhật trạng thái máy in thành công!');
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái máy in:', error);
        } finally {
            setLoading(false);
        }
    };

    const confirmDeletePrinter = (id) => {
        setPrinterToDelete(id);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (printerToDelete) {
            await handleDeletePrinter(printerToDelete);
            setShowDeleteConfirm(false);
            setPrinterToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
        setPrinterToDelete(null);
    };

    useEffect(() => {
        if (showAddForm && addButtonRef.current) {
            const rect = addButtonRef.current.getBoundingClientRect();
            setPopupPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
        }
    }, [showAddForm]);

    return (
        <Layout>
            <div className="relative">
                {loading && <Loader />}
                <div className="rounded-t-xl top-0 py-5 px-10 bg-white z-5">
                    <h2 className="text-2xl font-poppins_bold">Quản lý máy in</h2>
                    <div className="flex space-x-4 mt-4 justify-between">
                        <div className="flex space-x-4">
                            <button
                                onClick={() => toggleFilter('working')}
                                className={`py-2 px-4 rounded-full ${filter === 'working' ? 'bg-green-100 text-green-500' : 'bg-gray-200 text-gray-800'}`}
                            >
                                Đang hoạt động
                            </button>
                            <button
                                onClick={() => toggleFilter('not-working')}
                                className={`py-2 px-4 rounded-full ${filter === 'not-working' ? 'bg-red-100 text-red-500' : 'bg-gray-200 text-gray-800'}`}
                            >
                                Không hoạt động
                            </button>
                        </div>
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Tìm kiếm để lọc dữ liệu..."
                            className="py-2 pl-4 pr-10 rounded-full border border-gray-300"
                        />
                        <button
                            ref={addButtonRef}
                            onClick={() => setShowAddForm(true)}
                            className="py-2 px-4 rounded-full font-poppins_bold bg-black text-white hover:bg-[#1488D8]"
                        >
                            Thêm máy in
                        </button>
                    </div>
                </div>
                {showAddForm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 border-gray-500 rounded-2xl shadow-lg">
                            <h3 className="text-xl font-poppins_bold mb-4">Thêm máy in mới</h3>
                            <form onSubmit={handleAddPrinter}>
                                <div className="mb-4 flex items-center justify-end">
                                    <label htmlFor="printerPID" className="block text-gray-700 text-left mr-4 w-32">Mã máy in:</label>
                                    <input
                                        id="printerPID"
                                        type="text"
                                        value={newPrinter.pid}
                                        onChange={(e) => setNewPrinter({...newPrinter, pid: e.target.value})}
                                        className="w-64 px-3 py-2 border rounded-md"
                                        required
                                    />
                                </div>
                                <div className="mb-4 flex items-center justify-end">
                                    <label htmlFor="printerName" className="block text-gray-700 text-left mr-4 w-32">Tên máy in:</label>
                                    <input
                                        id="printerName"
                                        type="text"
                                        value={newPrinter.name}
                                        onChange={(e) => setNewPrinter({...newPrinter, name: e.target.value})}
                                        className="w-64 px-3 py-2 border rounded-md"
                                        required
                                    />
                                </div>
                                <div className="mb-4 flex items-center justify-end">
                                    <label htmlFor="printerPlace" className="block text-gray-700 text-left mr-4 w-32">Vị trí:</label>
                                    <select
                                        id="printerPlace"
                                        value={newPrinter.place}
                                        onChange={(e) => setNewPrinter({...newPrinter, place: e.target.value})}
                                        className={`w-64 px-3 py-2 border rounded-md ${newPrinter.place === '' ? 'text-gray-400' : 'text-black'}`}
                                        required
                                    >
                                        <option value="" disabled hidden>Chọn địa điểm</option>
                                        <option value="b1-ltk" className="text-black">B1 BK-LTK</option>
                                        <option value="b2-ltk" className="text-black">B2 BK-LTK</option>
                                        <option value="b3-ltk" className="text-black">B3 BK-LTK</option>
                                        <option value="b4-ltk" className="text-black">B4 BK-LTK</option>
                                        <option value="b5-ltk" className="text-black">B5 BK-LTK</option>
                                        <option value="b6-ltk" className="text-black">B6 BK-LTK</option>
                                        <option value="h1-dan" className="text-black">H1 BK-DAn</option>
                                        <option value="h2-dan" className="text-black">H2 BK-DAn</option>
                                        <option value="h3-dan" className="text-black">H3 BK-DAn</option>
                                        <option value="h4-dan" className="text-black">H6 BK-DAn</option>
                                    </select>
                                </div>
                                <div className="mb-4 flex items-center justify-end">
                                    <label htmlFor="printerStatus" className="block text-gray-700 text-left mr-4 w-32">Trạng thái:</label>
                                    <select
                                        id="printerStatus"
                                        value={newPrinter.working}
                                        onChange={(e) => setNewPrinter({...newPrinter, working: e.target.value === 'true'})}
                                        className="w-64 px-3 py-2 border rounded-md"
                                        required
                                    >
                                        <option value="true">Đang hoạt động</option>
                                        <option value="false">Không hoạt động</option>
                                    </select>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="py-2 px-4 rounded-full hover:bg-[#1488D8] bg-black text-white mr-3"
                                    >
                                        Thêm
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddForm(false)}
                                        className="py-2 px-4 rounded-full bg-gray-500 hover:bg-[#1488D8] text-white"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                <div className="border border-gray-300 rounded-2xl mx-10 mb-5">
                    <ul className="overflow-y-auto w-full">
                        <li className="col-span-24 grid grid-cols-24 gap-3 p-5 border-b border-gray-250 font-poppins_bold">
                            <span className="col-span-1"></span>
                            <button className="col-span-2 select-none text-left"
                                    onClick={() => handleSort('createdAt')}>
                                Ngày tạo {getSortArrow('createdAt')}
                            </button>
                            <button className="col-span-9 select-none text-left"
                                    onClick={() => handleSort('name')}>
                                Tên máy in {getSortArrow('name')}
                            </button>
                            <button className="col-span-8 select-none text-center"
                                    onClick={() => handleSort('place')}>
                                Vị trí {getSortArrow('place')}
                            </button>
                            <button className="col-span-3 select-none text-center"
                                    onClick={() => handleSort('working')}>
                                Trạng thái {getSortArrow('working') }
                            </button>
                            <button className="col-span-1    text-center">
                                Xóa
                            </button>
                        </li>
                        {sortedPrinterList.map((printer) => (
                            <li key={printer.id}
                                className="col-span-24 grid grid-cols-24 gap-4 py-2 pb-5 px-4 border-b border-gray-250">
                                <span className="col-span-1 flex justify-center">
                                    <button
                                        className="w-6 h-6 cursor-pointer"
                                        onClick={(e) => handleInfoClick(printer, e)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                handleInfoClick(printer, e);
                                            }
                                        }}
                                    >
                                        <img src={info} alt="info icon" className="w-6 h-6"/>
                                    </button>
                                </span>
                                <span
                                    className="col-span-2">{printer.createdAt?.toDate().toLocaleString('vi-VN', {hour12: false})}
                                </span>
                                <span className="col-span-9">{printer.name}</span>
                                <span className="col-span-8 text-center">{printer.place.toUpperCase()}</span>
                                <span className="col-span-3 text-center inline-flex items-center justify-center">
                                    <button
                                        className={`inline-block font-poppins_bold px-2 py-1 rounded-full ${printer.working ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}
                                        onClick={() => handleToggleWorking(printer.id, printer.working)}
                                        draggable="false"
                                        style={{cursor: 'pointer'}}
                                    >
                                        {printer.working ? 'Đang hoạt động' : 'Không hoạt động'}
                                    </button>
                                </span>
                                <span className="col-span-1 flex justify-center items-center">
                                    <button
                                        className="h-6 cursor-pointer"
                                        onClick={() => confirmDeletePrinter(printer.id)}
                                    >
                                        <img src={trash} alt="delete icon" className="w-6 h-6"/>
                                    </button>
                                </span>
                            </li>
                        ))}
                    </ul>
                    {selectedPrinter && (
                        <div ref={popupRef} className="absolute bg-white p-4 border-gray-500 rounded-xl shadow"
                             style={{top: popupPosition.top - 55, left: popupPosition.left}}>
                            <p className=""><strong>Mã máy in:</strong> {selectedPrinter.pid}</p>
                        </div>
                    )}
                    {showDeleteConfirm && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <div className="bg-white p-6 rounded-2xl shadow-lg">
                                <h3 className="text-xl font-poppins_bold mb-4">Xác nhận xóa</h3>
                                <p>Bạn có chắc chắn muốn xóa máy in này không?</p>
                                <div className="flex justify-end mt-4">
                                    <button
                                        onClick={handleConfirmDelete}
                                        className="py-2 px-4 rounded-full bg-black hover:bg-red-700 text-white mr-2"
                                    >
                                        Xóa
                                    </button>
                                    <button
                                        onClick={handleCancelDelete}
                                        className="py-2 px-4 rounded-full bg-gray-500 hover:bg-[#1488D8] text-white"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default PrinterManage;