import { useEffect, useCallback, useState, useRef } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';

const Payment = ({ isOpen, onRequestClose, onConfirm, price, poid }) => {
    const API_KEY = "AK_CS.1cba54d0c04311ef9cf3ed0b3d7702f1.7thTONKCKx858rqZG4S1HUBKkcXNXPdeykjLL5CsKr5A0IFmD8XXLnePkB5HRxu8CKRYHnZs";
    const API_GET_PAID = "https://oauth.casso.vn/v2/transactions";
    const POLLING_INTERVAL = 500;
    const TIMEOUT = 60000;

    const [remainingTime, setRemainingTime] = useState(TIMEOUT / 1000);
    const timerRef = useRef(null);

    const sanitizePoid = (poid) => {
        return poid.replace(/[^a-zA-Z0-9]/g, '').slice(0, 15);
    };

    const sanitizedPoid = sanitizePoid(poid);

    const imageUrl = `https://img.vietqr.io/image/970416-18861491-compact2.png?amount=${price}&addInfo=Thanh%20toan%20cho%20don%20hang%20${sanitizedPoid}%20&accountName=PHAN%20THANH%20BINH%20`;

    const checkPaid = useCallback(async () => {
        const response = await fetch(API_GET_PAID, {
            headers: {
                Authorization: `apikey ${API_KEY}`,
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        console.log(data);

        const containsPoid = (obj) => {
            if (typeof obj === 'string') {
                return obj.includes(sanitizedPoid);
            }
            if (typeof obj === 'object' && obj !== null) {
                return Object.values(obj).some(value => containsPoid(value));
            }
            return false;
        };

        const isPaid = containsPoid(data);
        console.log(`Payment status for ${sanitizedPoid}: ${isPaid ? 'Success' : 'Not Found'}`);
        return isPaid;
    }, [API_GET_PAID, API_KEY, sanitizedPoid]);

    const handleConfirm = useCallback(async () => {
        const startTime = Date.now();

        const poll = async () => {
            try {
                const isPaid = await checkPaid();
                if (isPaid) {
                    onConfirm();
                    onRequestClose(true);
                } else if (Date.now() - startTime >= TIMEOUT) {
                    onRequestClose(false);
                } else {
                    setRemainingTime(Math.max(0, TIMEOUT - (Date.now() - startTime)) / 1000);
                    timerRef.current = setTimeout(poll, POLLING_INTERVAL);
                }
            } catch (error) {
                console.error('Payment check failed:', error);
                onRequestClose(false);
            }
        };
        await poll();
    }, [checkPaid, onConfirm, onRequestClose]);

    useEffect(() => {
        if (isOpen) {
            setRemainingTime(TIMEOUT / 1000);
            void handleConfirm();
        } else {
            clearTimeout(timerRef.current); // Clear the timer when modal is closed
        }
    }, [isOpen, handleConfirm]);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => onRequestClose(false)}
            contentLabel="Kiểm tra giao dịch"
            ariaHideApp={false}
            style={{
                overlay: {zIndex: 1000},
                content: {
                    borderRadius: '15px',
                    width: '75%',
                    maxWidth: '75%',
                    margin: 'auto'
                }
            }}
        >
            <h1 className="text-2xl font-poppins_bold py-3 px-10">Kiểm tra giao dịch</h1>
            <p className="justify-center w-3/4 p-5 mx-auto">
                <span className="break-words">Hãy quét mã QR code bên dưới để thanh toán tổng đơn hàng</span>
                <span className="break-all px-1 font-poppins_semibold">{sanitizedPoid}</span>
                <span>trị giá</span>
                <span className="px-1 font-poppins_semibold">{price}</span>
                <span>VND</span>
            </p>
            <div className="flex justify-center items-center">
                <img src={imageUrl} alt="Payment QR Code"/>
            </div>
            <div className="flex justify-center items-center mt-4">
                <span className="text-gray-400 font-poppins">Thời gian hiệu lực mã QR: {remainingTime.toFixed(0)} giây</span>
            </div>
        </Modal>
    );
}

Payment.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    price: PropTypes.number.isRequired,
    poid: PropTypes.string.isRequired,
};

export default Payment;