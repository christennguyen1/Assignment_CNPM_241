import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { fireDB } from '../../firebase/FirebaseConfig.jsx';
import pending from '../../assets/pending.svg';
import approve from '../../assets/approve.svg';
import reject from '../../assets/reject.svg';

const PrintHistory = () => {
    const [printHistory, setPrintHistory] = useState([]);
    const user = JSON.parse(localStorage.getItem('users'));

    useEffect(() => {
        const fetchPrintHistory = async () => {
            try {
                const q = query(collection(fireDB, 'print-order'), where('user', '==', user.uid));
                const querySnapshot = await getDocs(q);
                const history = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPrintHistory(history);
            } catch (error) {
                console.error('Error fetching print history:', error);
            }
        };
        void fetchPrintHistory();
    }, [user.uid]);

    const statusMap = {
        pending: { text: 'Chờ', icon: pending },
        approve: { text: 'Xong', icon: approve },
        reject: { text: 'Hủy', icon: reject },
    };

    return (
        <div className="relative">
            <div className="sticky rounded-t-xl top-0 py-5 px-8 bg-white z-5 shadow">
                <h2 className="text-xl font-poppins_bold">Lịch sử in</h2>
            </div>
            <ul className="list-none overflow-y-auto h-[calc(100vh-8rem)] w-full">
                {printHistory.map((order) => (
                    <li key={order.id}
                        className={`py-2 px-2 border-b border-gray-200 flex items-center w-full`}>
                        <div className="w-2/3 flex-col ml-6">
                            <div className='flex'>Ngày in: <p
                                className='font-bold ml-1'>{order.createdAt.toDate().toLocaleString('vi-VN', {hour12: false})}</p>
                            </div>
                            <div className='flex'>Đã sử dụng: <p
                                className='font-bold ml-1'>{order.totalPages} tờ {order.paperSize.toUpperCase()}</p>
                            </div>
                            <div className='flex'>Địa điểm:
                                <p className='font-bold ml-1'>
                                    {order.location === 'custom' ? 'Ship tận nơi' : order.location.toUpperCase()}
                                </p>
                            </div>
                            <div className='flex'>Tổng giá: <p className='font-bold ml-1'>{order.totalPrice} VND</p>
                            </div>
                        </div>
                        <div className='flex-col ml-5 flex items-center w-1/3'>
                            <div className='flex flex-col items-center justify-end w-full'>
                                <p className="whitespace-nowrap font-poppins_semibold p-2">{statusMap[order.status]?.text || order.status}</p>
                                {statusMap[order.status] &&
                                    <img src={statusMap[order.status].icon} alt={order.status} className='w-8 h-8' />}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PrintHistory;