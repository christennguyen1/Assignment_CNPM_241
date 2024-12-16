import { useState, useRef, useEffect } from 'react';
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/legacy/build/pdf.worker.min.mjs`;

const OrderPrint = () => {
    const user = JSON.parse(localStorage.getItem('users'));
    const [dragging, setDragging] = useState(false);
    const [location, setLocation] = useState('');
    const [customLocation, setCustomLocation] = useState('');
    const [paperSize, setPaperSize] = useState('');
    const [copies, setCopies] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const [printer, setPrinter] = useState('');
    const [sides, setSides] = useState('');
    const [totalPages, setTotalPages] = useState(0);
    const [fileNames, setFileNames] = useState([]);
    const fileInputRef = useRef(null);

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

    const handleDrop = async (e) => {
        e.preventDefault();
        setDragging(false);
        const files = Array.from(e.dataTransfer.files);
        const fileNamesArray = files.map(file => file.name);
        setFileNames(prevFileNames => [...prevFileNames, ...fileNamesArray]);
        await handleFiles(files);
    };

    const handleBoxClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        const fileNamesArray = files.map(file => file.name);
        setFileNames(prevFileNames => [...prevFileNames, ...fileNamesArray]);
        await handleFiles(files);
    };

    const handleFiles = async (files) => {
        let TotalPageCount = totalPages;

        for (const file of files) {
            if (file.type === 'application/pdf') {
                try {
                    const arrayBuffer = await file.arrayBuffer();
                    const loadingTask = pdfjsLib.getDocument({data: arrayBuffer});
                    const pdfDoc = await loadingTask.promise;
                    TotalPageCount += pdfDoc.numPages;
                } catch (error) {
                    console.error('Error loading PDF:', error);
                }
            } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'application/msword') {
                try {
                    const arrayBuffer = await file.arrayBuffer();
                    const result = await mammoth.extractRawText({arrayBuffer});
                    const wordCount = result.value.split(/\s+/).length;
                    const estimatedPages = Math.ceil(wordCount / 500); // Assuming 500 words per page
                    TotalPageCount += estimatedPages;
                } catch (error) {
                    console.error('Error loading DOC/DOCX:', error);
                }
            }
        }

        setTotalPages(TotalPageCount);
    };

    const handleLocationChange = (e) => {
        setLocation(e.target.value);
        if (e.target.value !== 'custom') {
            setCustomLocation('');
        }
    };

    const handlePaperSizeChange = (e) => {
        setPaperSize(e.target.value);
    };

    const handleCopiesChange = (e) => {
        setCopies(e.target.value);
    };

    const handlePrinterChange = (e) => {
        setPrinter(e.target.value);
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
            switch (paperSize) {
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
    }, [paperSize, copies, location, totalPages]);

    return (
        <div
            className="flex-[2_1_60%] border border-gray-300 flex flex-col items-start justify-start p-3 relative">
            <div className="mt-5 mb-5 ml-5">
                <h2 className='text-left text-2xl font-bold'>
                    Đặt in
                </h2>
            </div>

            <div className="w-full flex">
                {/* Left Column */}
                <div className="w-1/2 pr-2 ml-5 mr-14">
                    <div className="w-full flex items-center mb-3">
                        <label htmlFor="printer" className="w-1/3">Địa điểm:</label>
                        <select
                            className={`w-2/3 border border-gray-300 py-2 px-1 rounded-md ${
                                location === '' ? 'text-gray-400' : 'text-black'
                            }`}
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
                                <label htmlFor="printer" className="w-1/3">Địa chỉ ship:</label>
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
                        <label htmlFor="printer" className="w-1/3">Khổ giấy:</label>
                        <select
                            className={`w-2/3 border border-gray-300 py-2 px-1 rounded-md ${
                                paperSize === '' ? 'text-gray-400' : 'text-black'
                            }`}
                            value={paperSize}
                            onChange={handlePaperSizeChange}
                        >
                            <option value="" className="ml-1" disabled hidden>
                                Chọn khổ giấy
                            </option>
                            <option value="a3" className="text-black">A3</option>
                            <option value="a4" className="text-black">A4</option>
                            <option value="a5" className="text-black">A5</option>
                        </select>
                    </div>
                    <div className="w-full flex items-center mb-3">
                        <label htmlFor="printer" className="w-1/3">Số bản:</label>
                        <input
                            type="number"
                            className="w-2/3 border border-gray-300 p-2 rounded-md"
                            placeholder="Nhập số bản"
                            min="1"
                            value={copies}
                            onChange={handleCopiesChange}
                        />
                    </div>
                    <div className="w-full flex items-center mb-3">
                        <span className="w-1/3"></span>
                        <span className="w-2/3 text-sm text-gray-400">Số giấy còn lại: 0</span>
                    </div>
                </div>

                {/* Right Column */}
                <div className="w-1/2 pl-2 mr-5">
                    <div className="w-full flex items-center mb-3">
                        <label htmlFor="printer" className="w-1/3">Email:</label>
                        <div
                            className="w-2/3 border border-gray-300 py-2 px-2 rounded-md overflow-hidden text-ellipsis whitespace-nowrap">
                                {user?.email}
                        </div>
                    </div>
                    <div className="w-full flex items-center mb-3">
                        <label htmlFor="printer" className="w-1/3">Máy in:</label>
                        <select
                            className={`w-2/3 border border-gray-300 py-2 px-1 rounded-md ${
                                printer === '' ? 'text-gray-400' : 'text-black'
                            }`}
                            value={printer}
                            onChange={handlePrinterChange}
                        >
                            <option value="" disabled hidden>Chọn máy in</option>
                            <option value="printerany" className="text-black">Máy in bất kỳ</option>
                            <option value="printer1" className="text-black">Máy in Canon</option>
                            <option value="printer2" className="text-black">Máy in HP</option>
                        </select>
                    </div>
                    <div className="w-full flex items-center mb-3">
                        <label htmlFor="printer" className="w-1/3">Số mặt:</label>
                        <select
                            className={`w-2/3 border border-gray-300 py-2 px-1 rounded-md ${
                                sides === '' ? 'text-gray-400' : 'text-black'
                            }`}
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
                    className={`flex-grow flex rounded-md border bg-gray-50 ${dragging ? 'border-blue-500' : 'border-dashed border-gray-300'} p-5  mt-3 mb-5 ml-5 mr-5 items-center justify-center text-gray-400`}
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
                        style={{display: 'none'}}
                        accept=".pdf, .docx, .doc"
                        multiple
                        onChange={handleFileChange}
                    />
                    <ul className="list-disc mt-3">
                        {fileNames.map((fileName) => (
                            <li key={fileName} className="text-black flex items-center">
                                <span className="mr-2">•</span>
                                <span>{fileName}</span>
                            </li>
                        ))}
                    </ul>
                </button>
            </div>


            {/* Total Pages and Total Pr    ice */}
            <class className="w-full flex">
                <div className='w-1/2 flex flex-col ml-5'>
                    <p className='text-gray-400 text-sm'>Tổng trang: {totalPages}</p>
                    <span className='text-black font-bold'>Tổng giá: {totalPrice} VND</span>
                </div>

                {/* Submit Button */}
                <div className='w-1/2 flex justify-end mr-5 mb-5'>
                    <input
                        type="submit"
                        value="Đặt in"
                        className='text-white bg-black border border-black hover:bg-gray-600 hover:text-black py-2 px-4 font-bold rounded-md mt-2'
                    />
                </div>
            </class>
        </div>
    );
}

export default OrderPrint