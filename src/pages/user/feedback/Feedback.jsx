import { useNavigate } from "react-router";
import Layout from "../../../components/layout/Layout.jsx";
import { useContext, useState, useEffect, useCallback } from "react";
import myContext from "../../../context/myContext.jsx";
import toast from "react-hot-toast";
import Loader from "../../../components/loader/Loader.jsx";
import { collection, addDoc, setDoc, query, getDocs } from "firebase/firestore";
import { fireDB } from "../../../firebase/FirebaseConfig.jsx";
import wallpaper from "../../../assets/feedback_wallpaper.png";
import love from "../../../assets/love.svg";
import like from "../../../assets/like.svg";
import neutral from "../../../assets/neutral.svg";
import dislike from "../../../assets/dislike.svg";
import hate from "../../../assets/hate.svg";

const Feedback = () => {
    const context = useContext(myContext);
    const { loading, setLoading } = context;
    const [printers, setPrinters] = useState([]);
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [filteredPrinters, setFilteredPrinters] = useState([]);
    const [selectedPrinter, setSelectedPrinter] = useState("");


    // navigate
    const navigate = useNavigate();

    // Report State
    const [report, setReport] = useState({
        title: "",
        description: ""
    });

    // Option State
    const [option, setOption] = useState("report");

    // Emotion State
    const [emotion, setEmotion] = useState("");

    const sendFeedbackFunction = useCallback(async () => {
        // validation
        if (report.title === "" || report.description === "" || (option === "feedback" && emotion === "") || (option === "report" && (selectedLocation === "" || selectedPrinter === ""))) {
            toast.error("Tất cả các trường là bắt buộc");
            return;
        }

        setLoading(true);
        try {
            const feedbackRef = await addDoc(collection(fireDB, "feedback"), {
                title: report.title,
                description: report.description,
                uid: JSON.parse(localStorage.getItem('users')).uid,
                timestamp: new Date(),
                type: option,
                emotion: option === "feedback" ? emotion : null,
                printer: option === "report" ? selectedPrinter : null
            });

            // Add fid field
            await setDoc(feedbackRef, { fid: feedbackRef.id }, { merge: true });

            setReport({
                title: "",
                description: ""
            });
            setEmotion("");
            toast.success("Gửi yêu cầu thành công");
            setLoading(false);
            navigate('/');
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error("Gửi yêu cầu thất bại");
        }
    }, [report, setLoading, navigate, option, emotion, selectedLocation, selectedPrinter]);


    const handleCancel = useCallback(() => {
        setReport({
            title: "",
            description: ""
        });
        setEmotion("");
        navigate('/');
    }, [navigate]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                handleCancel();
            } else if (event.key === 'Enter') {
                sendFeedbackFunction().catch(error => console.error(error));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleCancel, sendFeedbackFunction, report]);

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
                    working: doc.data().working // Ensure working attribute is included
                }));
                setPrinters(printerList);

                // Extract unique locations
                const locationList = [...new Set(printerList.map(printer => printer.place))];
                setLocations(locationList);
            } catch (error) {
                console.error("Error fetching printers: ", error);
            } finally {
                setLoading(false);
            }
        };

        void fetchPrinters();
    }, [setLoading]);

    const handleLocationChange = (e) => {
        const location = e.target.value;
        setSelectedLocation(location);
        const filtered = printers.filter(printer => printer.place === location);
        setFilteredPrinters(filtered);
        setSelectedPrinter(""); // Reset selected printer when location changes
    };

    const handlePrinterChange = (e) => {
        setSelectedPrinter(e.target.value);
    };

    return (
        <div className="relative">
            {/* Darken Layout */}
            <Layout>
                <button
                    className="absolute inset-0 bg-black bg-opacity-50 z-20"
                    onClick={() => handleCancel().catch(error => console.error(error))}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            handleCancel().catch(error => console.error(error));
                        }
                    }}
                ></button>
                <img className="absolute top-0 left-0 z-0 w-full h-full object-cover" src={wallpaper} alt=""/>
            </Layout>

            {/* Main Content */}
            <div className="absolute inset-0 flex justify-center items-center z-30">
                {loading && <Loader/>}

                {/* Report Form */}
                <form
                    className="login_Form bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl h-4/5 flex flex-col"
                    onSubmit={(e) => {
                        e.preventDefault();
                        sendFeedbackFunction().catch(error => console.error(error));
                    }}
                >
                    {/* Top Heading */}
                    <div className="mb-3">
                        <h2 className='text-left text-2xl font-poppins_bold'>
                            Phản hồi
                        </h2>
                        <div className='text-left'>
                            Vui lòng chọn loại phản hồi và điền thông tin chi tiết:
                        </div>
                    </div>

                    {/* Option Selection */}
                    <div className="flex flex-col mb-3">
                        <input
                            type="radio"
                            id="report"
                            name="option"
                            value="report"
                            checked={option === "report"}
                            onChange={(e) => setOption(e.target.value)}
                        />
                        <label htmlFor="report" className="flex items-center font-poppins_semibold">
                            Báo lỗi
                        </label>
                        <input
                            type="radio"
                            id="feedback"
                            name="option"
                            value="feedback"
                            checked={option === "feedback"}
                            onChange={(e) => setOption(e.target.value)}
                        />
                        <label htmlFor="feedback" className="flex items-center font-poppins_semibold">
                            Đánh giá chất lượng dịch vụ
                        </label>
                    </div>

                    {/* Location and Printer Selection */}
                    {option === "report" && (
                        <div className="w-full flex items-center justify-between">
                            <div className="flex w-1/2 items-center">
                                <label htmlFor="location" className="mr-5">Địa điểm:</label>
                                <select
                                    id="location"
                                    value={selectedLocation}
                                    onChange={handleLocationChange}
                                    className={`bg-gray-200 px-2 py-2 rounded-md w-3/4 ${selectedLocation === '' ? 'text-gray-500' : 'text-black'}`}
                                >
                                    <option value="" disabled hidden>Chọn địa điểm</option>
                                    {locations.map((location) => (
                                        <option key={location} value={location} className="text-black">{location.toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end w-1/2 items-center">
                                <label htmlFor="printer" className="mr-5">Máy in:</label>
                                <select
                                    id="printer"
                                    value={selectedPrinter}
                                    onChange={handlePrinterChange}
                                    className="bg-gray-200 px-2 py-2 rounded-md w-3/4"
                                >
                                    <option value="" disabled hidden>Chọn máy in</option>
                                    {filteredPrinters.filter(printer => printer.working).map((printer) => (
                                        <option key={printer.id} value={printer.id} className="text-black">
                                            {printer.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Emotion Selection */}
                    {option === "feedback" && (
                        <div>
                            <label htmlFor="emotion" className="block">Xin hãy đánh giá trải nghiệm
                                dịch vụ của bạn:</label>
                            <div className="flex space-x-4 mt-2">
                            <button
                                    type="button"
                                    onClick={() => setEmotion("love")}
                                    className={`cursor-pointer ${emotion === "love" ? "w-16 h-16" : "w-12 h-12 opacity-50"}`}
                                >
                                    <img
                                        src={love}
                                        alt="Love"
                                        draggable="false"
                                        className="w-full h-full"
                                    />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEmotion("like")}
                                    className={`cursor-pointer ${emotion === "like" ? "w-16 h-16" : "w-12 h-12 opacity-50"}`}
                                >
                                    <img
                                        src={like}
                                        alt="Like"
                                        draggable="false"
                                        className="w-full h-full"
                                    />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEmotion("neutral")}
                                    className={`cursor-pointer ${emotion === "neutral" ? "w-16 h-16" : "w-12 h-12 opacity-50"}`}
                                >
                                    <img
                                        src={neutral}
                                        alt="Neutral"
                                        draggable="false"
                                        className="w-full h-full"
                                    />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEmotion("dislike")}
                                    className={`cursor-pointer ${emotion === "dislike" ? "w-16 h-16" : "w-12 h-12 opacity-50"}`}
                                >
                                    <img
                                        src={dislike}
                                        alt="Dislike"
                                        draggable="false"
                                        className="w-full h-full"
                                    />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEmotion("hate")}
                                    className={`cursor-pointer ${emotion === "hate" ? "w-16 h-16" : "w-12 h-12 opacity-50"}`}
                                >
                                    <img
                                        src={hate}
                                        alt="Hate"
                                        draggable="false"
                                        className="w-full h-full"
                                    />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Input One */}
                    <div className="pt-3">
                        <label htmlFor="title" className="block">Tiêu đề</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            placeholder={option === "feedback" ? 'Tiêu đề đánh giá của bạn?' : 'Tên lỗi bạn gặp phải?'}
                            value={report.title}
                            onChange={(e) => {
                                setReport({
                                    ...report,
                                    title: e.target.value
                                });
                            }}
                            className='bg-gray-200 px-2 py-2 w-full rounded-md outline-none placeholder-gray-500'
                        />
                    </div>

                    {/* Input Two */}
                    <div className="mb-5 flex-grow">
                        <label htmlFor="description" className="block">Mô tả</label>
                        <textarea
                            id="description"
                            placeholder={option === "feedback" ? 'Chi tiết đánh giá của bạn?' : 'Chi tiết loại lỗi bạn gặp phải là gì?'}
                            value={report.description}
                            onChange={(e) => {
                                setReport({
                                    ...report,
                                    description: e.target.value
                                });
                            }}
                            className='bg-gray-200 px-2 py-2 w-full rounded-md outline-none placeholder-gray-500 h-full'
                        />
                    </div>

                    {/* Submit and Cancel Buttons */}
                    <div className="mb-3 flex justify-end mt-5">
                        <button
                            type='submit'
                            className='text-white bg-black hover:bg-[#1488D8] hover:scale-105 text-center py-2 px-4 font-poppins_bold rounded-full mr-2'
                        >
                            Gửi yêu cầu
                        </button>
                        <button
                            type='button'
                            onClick={() => handleCancel().catch(error => console.error(error))}
                            className='bg-gray-500 hover:bg-[#1488D8] hover:scale-105 text-white text-center py-2 px-4 font-poppins_bold rounded-full ml-2'
                        >
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Feedback;