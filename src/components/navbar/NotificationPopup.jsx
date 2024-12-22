import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { fireDB } from '../../firebase/FirebaseConfig.jsx';

const NotificationPopup = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!userId) {
            console.error('Mã người dùng không xác định');
            return;
        }

        const q = query(collection(fireDB, 'notification'), where('userId', '==', userId));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const notifs = [];
            querySnapshot.forEach((doc) => {
                notifs.push({ id: doc.id, ...doc.data() });
            });
            setNotifications(notifs);
            console.log('Đã fetch thông báo:', notifs);
        }, (error) => {
            console.error('Lỗi khi fetch thông báo:', error);
        });

        return () => unsubscribe();
    }, [userId]);

    return (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
            <ul>
                {notifications.length > 0 ? (
                    notifications.map((notif) => (
                        <li key={notif.id} className="p-2 border-b border-gray-200">
                            {notif.message}
                        </li>
                    ))
                ) : (
                    <li className="p-2 border-b border-gray-200">You have no notifications</li>
                )}
            </ul>
        </div>
    );
};

NotificationPopup.propTypes = {
    userId: PropTypes.string.isRequired,
};

export default NotificationPopup;