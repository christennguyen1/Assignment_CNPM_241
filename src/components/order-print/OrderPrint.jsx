import { useState, useCallback, useRef, useEffect, useContext } from 'react';
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import toast from "react-hot-toast";
import { fireDB, storage } from "../../firebase/FirebaseConfig.jsx";
import { Timestamp, addDoc, setDoc, doc, collection, getDocs, getDoc, query } from "firebase/firestore";
import myContext from "../../context/myContext.jsx";
import Loader from "../loader/Loader.jsx";
import { ref, uploadBytesResumable } from "firebase/storage";
import trash from "../../assets/trash.svg";
import Payment from "../payment/Payment.jsx";
import { v4 as uuidv4 } from 'uuid';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/legacy/build/pdf.worker.min.mjs`;

const OrderPrint = () => {
    const user = JSON.parse(localStorage.getItem('users'));
    const context = useContext(myContext);
    const { loading, setLoading } = context;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [paymentResolve, setPaymentResolve] = useState(null);
    const [poid] = useState(uuidv4());

    const [dragging, setDragging] = useState(false);
    const [location, setLocation] = useState('');
    const [customLocation, setCustomLocation] = useState('');
    const [size, setSize] = useState('');
    const [copies, setCopies] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const [printer, setPrinter] = useState('');
    const [sides, setSides] = useState('');
    const [totalPages, setTotalPages] = useState(0);
    const [fileNames, setFileNames] = useState([]);
    const [files, setFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({});
    const [userPaperCount, setUserPaperCount] = useState(user[size]);
    const [printers, setPrinters] = useState([]);
    const [filteredPrinters, setFilteredPrinters] = useState([]);
    const fileInputRef = useRef(null);

    const getUserPaperCount = useCallback(async () => {
        try {
            const userRef = doc(fireDB, "user", user.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                setUserPaperCount(userData[size]);
            }
        } catch (error) {
            console.error('Lỗi không thể đếm trang tệp:', error);
        }
    }, [user.uid, size]);

    useEffect(() => {
        void getUserPaperCount();
    }, [getUserPaperCount]);

    const removeFile = async (fileName) => {
        const fileToRemove = files.find(file => file.name === fileName);

        if (fileToRemove) {
            let pagesToRemove = 0;
            if (fileToRemove.type === 'application/pdf') {
                const arrayBuffer = await fileToRemove.arrayBuffer();
                const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                pagesToRemove = pdfDoc.numPages;
            } else if (fileToRemove.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileToRemove.type === 'application/msword') {
                const arrayBuffer = await fileToRemove.arrayBuffer();
                const result = await mammoth.extractRawText({ arrayBuffer });
                const wordCount = result.value.split(/\s+/).length;
                pagesToRemove = Math.ceil(wordCount / 500); // Assuming 500 words per page
            }

            setTotalPages(prevTotalPages => prevTotalPages - pagesToRemove);
            setTotalPrice(prevTotalPrice => {
                let pricePerCopy;
                switch (size) {
                    case 'a3':
                        pricePerCopy = 600;
                        break;
                    case 'a4':
                        pricePerCopy = 300;
                        break;
                    case 'a5':
                        pricePerCopy = 150;
                        break;
                    default:
                        pricePerCopy = 0;
                }
                const priceToRemove = pricePerCopy * copies * pagesToRemove;
                return prevTotalPrice - priceToRemove;
            });
        }

        setFileNames(prevFileNames => prevFileNames.filter(name => name !== fileName));
        setFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
        setUploadProgress(prevProgress => {
            const newProgress = { ...prevProgress };
            delete newProgress[fileName];
            return newProgress;
        });
    };

    const handleUploadProgress = (file, snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(prevProgress => ({
            ...prevProgress,
            [file.name]: progress
        }));
    };

    const handleUploadError = (error, reject) => {
        console.error('Lỗi khi tải lên tệp:', error);
        reject(error);
    };

    const handleUploadSuccess = (resolve) => {
        console.log('Tệp tải lên thành công!');
        resolve();
    };

    const uploadFile = useCallback((file, oid) => {
        return new Promise((resolve, reject) => {
            if (!file) {
                console.error('Không thể xác định tệp');
                return;
            }
            try {
                const storageRef = ref(storage, `print-order/${user.uid}/${oid}/${file.name}`);
                const uploadTask = uploadBytesResumable(storageRef, file);

                uploadTask.on('state_changed',
                    (snapshot) => handleUploadProgress(file, snapshot),
                    (error) => handleUploadError(error, reject),
                    () => handleUploadSuccess(resolve)
                );
            } catch (error) {
                console.error('Lỗi không thể tải lên tệp:', error);
            }
        });
    }, [user.uid]);

    const processPayment = async () => {
        return new Promise((resolve) => {
            setPaymentResolve(() => resolve);
            setIsModalOpen(true);
        });
    };

    const handleConfirmPayment = () => {
        if (paymentResolve) paymentResolve(true);
        setIsModalOpen(false);
    };

    const handleCancelPayment = () => {
        if (paymentResolve) paymentResolve(false);
        setIsModalOpen(false);
    };

    const sendPrintOrderFunction = useCallback(async () => {
        if (location === "" || size === "" || copies === 0 || printer === "" || sides === "" || fileNames.length === 0) {
            toast.error("Tất cả các trường đặt in là bắt buộc");
            return;
        }

        let paperNeeded = totalPages * copies;
        if (sides === "2") {
            paperNeeded = Math.ceil(paperNeeded / 2);
        }

        if (paperNeeded > userPaperCount) {
            toast.error(`Bạn không có đủ giấy ${size.toUpperCase()} để hoàn thành yêu cầu in này`);
            return;
        }

        setLoading(true);
        try {
            const paymentSuccessful = await processPayment();
            if (!paymentSuccessful) {
                toast.error("Thanh toán thất bại");
                setLoading(false);
                return;
            }

            const docRef = await addDoc(collection(fireDB, "print-order"), {
                location: location,
                customLocation: customLocation,
                size: size,
                copies: copies,
                totalPrice: totalPrice,
                printer: printer,
                sides: sides,
                totalPages: totalPages,
                uid: user.uid,
                status: "pending",
                createdAt: Timestamp.now()
            });

            const oid = docRef.id;

            const uploadPromises = files.map(file => uploadFile(file, oid));
            await Promise.all(uploadPromises);

            await setDoc(doc(fireDB, "print-order", oid), { oid }, { merge: true });

            // Update user's paper count
            const newPaperCount = userPaperCount - paperNeeded;
            await setDoc(doc(fireDB, "user", user.uid), { [size]: newPaperCount }, { merge: true });

            setLoading(false);
            toast.success("Yêu cầu đặt in thành công\nẤn bất kì đâu để tiếp tục", {
                duration: 5000,
                onClick: () => window.location.reload()
            });

            document.body.addEventListener('click', () => window.location.reload(), { once: true });
        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.error("Lỗi không thể đặt in");
        }
    }, [location, size, copies, printer, sides, fileNames.length, setLoading, customLocation, totalPrice, totalPages, user.uid, files, uploadFile, userPaperCount]);

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const getUniqueFiles = (files, existingFileNames) => {
        const newFileNames = files.map(file => file.name);
        const uniqueFiles = files.filter(file => !existingFileNames.includes(file.name));
        const uniqueFileNames = uniqueFiles.map(file => file.name);

        if (uniqueFileNames.length < newFileNames.length) {
            toast.error("Một số tệp đã được thêm vào danh sách");
        }

        return { uniqueFiles, uniqueFileNames };
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        const validFiles = droppedFiles.filter(file =>
            file.type === 'application/pdf' ||
            file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            file.type === 'application/msword'
        );

        if (validFiles.length < droppedFiles.length) {
            toast.error("Chỉ chấp nhận tệp PDF, DOCX và DOC");
        }

        const { uniqueFiles, uniqueFileNames } = getUniqueFiles(validFiles, fileNames);

        setFileNames(prevFileNames => [...prevFileNames, ...uniqueFileNames]);
        setFiles(prevFiles => [...prevFiles, ...uniqueFiles]);
        await handleFiles(uniqueFiles);
    };

    const handleFileChange = async (e) => {
        const selectedFiles = Array.from(e.target.files);
        const validFiles = selectedFiles.filter(file =>
            file.type === 'application/pdf' ||
            file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            file.type === 'application/msword'
        );

        if (validFiles.length < selectedFiles.length) {
            toast.error("Chỉ chấp nhận tệp PDF, DOCX và DOC");
        }

        const { uniqueFiles, uniqueFileNames } = getUniqueFiles(validFiles, fileNames);

        setFileNames(prevFileNames => [...prevFileNames, ...uniqueFileNames]);
        setFiles(prevFiles => [...prevFiles, ...uniqueFiles]);
        await handleFiles(uniqueFiles);
    };

    const handleBoxClick = () => {
        fileInputRef.current.click();
    };

    const handleFiles = async (files) => {
        let TotalPageCount = totalPages;

        for (const file of files) {
            if (file.type === 'application/pdf') {
                try {
                    const arrayBuffer = await file.arrayBuffer();
                    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
                    const pdfDoc = await loadingTask.promise;
                    TotalPageCount += pdfDoc.numPages;
                } catch (error) {
                    console.error('Không thể đọc tệp PDF:', error);
                }
            } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'application/msword') {
                try {
                    const arrayBuffer = await file.arrayBuffer();
                    const result = await mammoth.extractRawText({ arrayBuffer });
                    const wordCount = result.value.split(/\s+/).length;
                    const estimatedPages = Math.ceil(wordCount / 500); // Assuming 500 words per page
                    TotalPageCount += estimatedPages;
                } catch (error) {
                    console.error('Không thể đọc tệp DOCX/DOC:', error);
                }
            }
        }

        setTotalPages(TotalPageCount);
    };

    const handleLocationChange = (e) => {
        const selectedLocation = e.target.value;
        setLocation(selectedLocation);
        if (selectedLocation === 'custom') {
            setFilteredPrinters(printers);
        } else {
            setFilteredPrinters(printers.filter(printer => printer.place === selectedLocation));
        }
    };

    const handlesizeChange = (e) => {
        setSize(e.target.value);
    };

    const handleCopiesChange = (e) => {
        setCopies(e.target.value);
    };

    const handleSidesChange = (e) => {
        setSides(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            handleBoxClick();
        }
    };

    useEffect(() => {
        const calculateTotalPrice = () => {
            let pricePerCopy;
            switch (size) {
                case 'a3':
                    pricePerCopy = 600;
                    break;
                case 'a4':
                    pricePerCopy = 300;
                    break;
                case 'a5':
                    pricePerCopy = 150;
                    break;
                default:
                    pricePerCopy = 0;
            }
            let total = pricePerCopy * copies * totalPages;
            if (location === 'custom') {
                total += 20000; // Phụ phí
            }
            setTotalPrice(total);
        };

        calculateTotalPrice();
    }, [size, copies, location, totalPages]);

    useEffect(() => {
        const fetchPrinters = async () => {
            setLoading(true);
            try {
                const q = query(collection(fireDB, 'printer'));
                const querySnapshot = await getDocs(q);
                const printerList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                    place: doc.data().place,
                    working: doc.data().working
                }));
                setPrinters(printerList);
            } catch (error) {
                console.error("Error fetching printers: ", error);
            } finally {
                setLoading(false);
            }
        };

        void fetchPrinters();
    }, [setLoading]);

    const handlePrinterChange = (e) => {
        setPrinter(e.target.value);
    };

    const workingPrinters = filteredPrinters.filter(printer => printer.working);

    return (
        <div
            className="flex-[2_1_60%] border rounded-xl border-gray-300 flex flex-col items-start justify-start p-3 relative">
            {loading && <Loader/>}
            <div className="mt-5 mb-5 ml-5">
                <h2 className='text-left text-2xl font-poppins_bold'>
                    Đặt in
                </h2>
            </div>

            <div className="w-full flex">
                {/* Left Column */}
                <div className="w-1/2 pr-2 ml-5 mr-14">
                    <div className="w-full flex items-center mb-3">
                        <label htmlFor="printing" className="w-1/3">Địa điểm:</label>
                        <select
                            className={`w-2/3 py-2 px-1 rounded-md ${
                                location === '' ? 'text-gray-400' : 'text-black'
                            } custom-select`}
                            value={location}
                            onChange={handleLocationChange}
                        >
                            <option value="" disabled hidden>
                                Chọn địa điểm
                            </option>
                            <option value="b1-ltk" className="text-black">
                                B1 BK-LTK
                            </option>
                            <option value="b2-ltk" className="text-black">
                                B2 BK-LTK
                            </option>
                            <option value="b3-ltk" className="text-black">
                                B3 BK-LTK
                            </option>
                            <option value="b4-ltk" className="text-black">
                                B4 BK-LTK
                            </option>
                            <option value="b5-ltk" className="text-black">
                                B5 BK-LTK
                            </option>
                            <option value="b6-ltk" className="text-black">
                                B6 BK-LTK
                            </option>
                            <option value="h1-dan" className="text-black">
                                H1 BK-DAn
                            </option>
                            <option value="h2-dan" className="text-black">
                                H2 BK-DAn
                            </option>
                            <option value="h3-dan" className="text-black">
                                H3 BK-DAn
                            </option>
                            <option value="h4-dan" className="text-black">
                                H6 BK-DAn
                            </option>
                            <option value="custom" className="text-black">
                                Ship tận nơi
                            </option>
                        </select>
                    </div>
                    {location === 'custom' && (
                        <>
                            <div className="w-full flex items-center mb-3">
                                <label htmlFor="printing" className="w-1/3">Địa chỉ ship:</label>
                                <input
                                    type="text"
                                    className="w-2/3 border border-gray-300 p-2 rounded-md"
                                    placeholder=" Nhập địa chỉ muốn ship đến"
                                    value={customLocation}
                                    onChange={(e) => setCustomLocation(e.target.value)}
                                />
                            </div>
                            <div className="w-full flex items-center mb-3">
                                <span className="w-1/3"></span>
                                <span className="w-2/3 text-sm text-gray-400">Phụ phí: 20000 VND</span>
                            </div>
                        </>
                    )}
                    <div className="w-full flex items-center mb-3">
                        <label htmlFor="printing" className="w-1/3">Khổ giấy:</label>
                        <select
                            className={`w-2/3 py-2 px-1 rounded-md ${size === '' ? 'text-gray-400' : 'text-black'} custom-select`}
                            value={size}
                            onChange={handlesizeChange}
                        >
                            <option value="" disabled hidden>
                                Chọn khổ giấy
                            </option>
                            <option value="a3" className="text-black">A3</option>
                            <option value="a4" className="text-black">A4</option>
                            <option value="a5" className="text-black">A5</option>
                        </select>
                    </div>
                    <div className="w-full flex items-center mb-3">
                        <label htmlFor="printing" className="w-1/3">Số bản:</label>
                        <input
                            type="number"
                            className="w-2/3 border border-gray-300 p-2 rounded-md"
                            placeholder="Nhập số bản"
                            min="1"
                            value={copies}
                            onChange={handleCopiesChange}
                        />
                    </div>
                    {size && (
                        <div className="w-full flex items-center mb-3">
                            <span className="w-1/3"></span>
                            <span className="w-2/3 text-sm text-gray-400">
                                Số giấy {size.toUpperCase()} còn lại: {userPaperCount} tờ
                            </span>
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div className="w-1/2 pl-2 mr-5">
                    <div className="w-full flex items-center mb-3">
                        <label htmlFor="printing" className="w-1/3">Email:</label>
                        <div
                            className="w-2/3 border border-gray-300 py-2 px-2 rounded-md overflow-hidden text-ellipsis whitespace-nowrap">
                            {user?.email}
                        </div>
                    </div>
                    <div className="w-full flex items-center mb-3">
                        <label htmlFor="printing" className="w-1/3">Máy in:</label>
                        <select
                            className={`w-2/3 py-2 px-1 rounded-md ${printer === '' ? 'text-gray-400' : 'text-black'} custom-select`}
                            value={printer}
                            onChange={handlePrinterChange}
                        >
                            <option value="" disabled hidden>Chọn máy in</option>
                            {workingPrinters.map((printer) => (
                                <option key={printer.id} value={printer.id} className="text-black">
                                    {printer.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="w-full flex items-center mb-3">
                        <label htmlFor="printing" className="w-1/3">Số mặt:</label>
                        <select
                            className={`w-2/3 py-2 px-1 rounded-md ${
                                sides === '' ? 'text-gray-400' : 'text-black'
                            } custom-select`}
                            value={sides}
                            onChange={handleSidesChange}
                        >
                            <option value="" disabled hidden>Chọn số mặt</option>
                            <option value="1" className="text-black">1 mặt</option>
                            <option value="2" className="text-black">2 mặt</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Drag-and-Drop Box */}
            <div className="flex-grow flex w-full">
                <button
                    className={`flex-grow flex rounded-md border bg-gray-50 ${dragging ? 'border-[#1488D8]' : 'border-dashed border-gray-300'} p-5  mt-3 mb-5 ml-5 mr-5 items-center justify-center text-gray-400`}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleBoxClick}
                    onKeyDown={handleKeyDown}
                >
                    {fileNames.length === 0 && "Click hoặc kéo thả tệp vào đây"}
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept=".pdf, .docx, .doc"
                        multiple
                        onChange={handleFileChange}
                    />
                    <ul className="list-disc mt-3">
                        {fileNames.map((fileName) => (
                            <li key={fileName} className="text-black flex items-center">
                                <span className="mr-2">•</span>
                                <span>{fileName}</span>
                                {uploadProgress[fileName] !== undefined && (
                                    <span className="ml-2 text-gray-500">
                                        {uploadProgress[fileName].toFixed(2)}%
                                    </span>
                                )}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        void removeFile(fileName);
                                    }}
                                    className="ml-2 text-red-500 hover:text-red-700"
                                >
                                    <img src={trash} alt="Remove" className="w-6 h-6"/>
                                </button>
                            </li>
                        ))}
                    </ul>
                </button>
            </div>

            {/* Total Pages and Total Price */}
            <div className="w-full flex">
                <div className='w-1/2 flex flex-col ml-5'>
                    <p className='text-gray-400 text-sm'>Tổng trang: {totalPages}</p>
                    <span className='font-poppins_bold'>Tổng giá: {totalPrice} VND</span>
                </div>

                {/* Submit Button */}
                <div className='w-1/2 flex justify-end mr-5 mb-5'>
                    <input
                        type="submit"
                        value="Đặt in"
                        onClick={sendPrintOrderFunction}
                        className='text-white bg-black hover:bg-[#1488D8] hover:scale-105 py-2 px-4 font-poppins_bold rounded-full mt-2 transition-transform duration-300'
                    />
                </div>
            </div>
            <Payment
                isOpen={isModalOpen}
                onRequestClose={handleCancelPayment}
                onConfirm={handleConfirmPayment}
                price={totalPrice}
                poid={poid}
            />
        </div>
    );
}

export default OrderPrint;