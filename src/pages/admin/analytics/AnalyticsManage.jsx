import { useContext, useEffect, useState } from 'react';
import Layout from "../../../components/layout/Layout.jsx";
import { fireDB } from "../../../firebase/FirebaseConfig.jsx";
import { collection, getDocs, query, where } from "firebase/firestore";
import myContext from "../../../context/myContext.jsx";
import Loader from "../../../components/loader/Loader.jsx";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays, eachDayOfInterval } from 'date-fns';

const AnalyticsManage = () => {
    const context = useContext(myContext);
    const { loading, setLoading } = context;
    const [revenueData, setRevenueData] = useState([]);

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalOrders: 0,
        totalPrice: 0,
        totalFeedbacks: 0,
        printerStats: {},
        emotionStats: {
            love: 0,
            like: 0,
            neutral: 0,
            dislike: 0,
            hate: 0,
        },
        averageEmotion: 0,
        feedbackPrinterStats: {},
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const usersSnapshot = await getDocs(collection(fireDB, 'user'));
                const ordersSnapshot = await getDocs(collection(fireDB, 'print-order'));
                const printsSnapshot = await getDocs(collection(fireDB, 'prints'));
                const paperSnapshot = await getDocs(collection(fireDB, 'paper'));
                const paperOrdersSnapshot = await getDocs(collection(fireDB, 'paper-order'));
                const feedbackSnapshot = await getDocs(collection(fireDB, 'feedback'));

                let totalPrice = 0;
                let printerStats = {};
                let emotionStats = {
                    love: 0,
                    like: 0,
                    neutral: 0,
                    dislike: 0,
                    hate: 0,
                };
                let feedbackPrinterStats = {};

                ordersSnapshot.forEach(doc => {
                    const data = doc.data();
                    totalPrice += data.totalPrice || 0;

                    if (data.printer) {
                        if (!printerStats[data.printer]) {
                            printerStats[data.printer] = 0;
                        }
                        printerStats[data.printer]++;
                    }
                });

                paperOrdersSnapshot.forEach(doc => {
                    totalPrice += doc.data().price || 0;
                });

                let validFeedbackCount = 0;
                feedbackSnapshot.forEach(doc => {
                    const data = doc.data();
                    if (data.emotion && data.emotion !== '' && emotionStats[data.emotion] !== undefined) {
                        emotionStats[data.emotion]++;
                        validFeedbackCount++;
                    }
                    if (data.printer && data.printer !== '') {
                        if (!feedbackPrinterStats[data.printer]) {
                            feedbackPrinterStats[data.printer] = 0;
                        }
                        feedbackPrinterStats[data.printer]++;
                    }
                });

                const totalEmotionScore = (emotionStats.love * 5) + (emotionStats.like * 4) + (emotionStats.neutral * 3) + (emotionStats.dislike * 2) + (emotionStats.hate);
                const averageEmotion = validFeedbackCount > 0 ? totalEmotionScore / validFeedbackCount : 0;

                setStats({
                    totalUsers: usersSnapshot.size,
                    totalOrders: ordersSnapshot.size,
                    totalPrints: printsSnapshot.size,
                    totalPaperBought: paperSnapshot.size,
                    totalPrice: totalPrice,
                    totalFeedbacks: validFeedbackCount,
                    printerStats: printerStats,
                    emotionStats: emotionStats,
                    averageEmotion: averageEmotion,
                    feedbackPrinterStats: feedbackPrinterStats,
                });
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu: ", error);
            } finally {
                setLoading(false);
            }
        };

        void fetchData();
    }, [setLoading]);

    const printerData = Object.entries(stats.printerStats).map(([printer, count]) => ({
        printer,
        count,
    }));

    const emotionData = Object.entries(stats.emotionStats).map(([emotion, count]) => ({
        name: emotion,
        value: count,
    }));

    const feedbackPrinterData = Object.entries(stats.feedbackPrinterStats).map(([printer, count]) => ({
        name: printer,
        value: count,
    }));

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const today = new Date();
                const startDate = subDays(today, 30);

                const printOrderQuery = query(collection(fireDB, 'print-order'), where('createdAt', '>=', startDate));
                const paperOrderQuery = query(collection(fireDB, 'paper-order'), where('timestamp', '>=', startDate));

                const printOrderSnapshot = await getDocs(printOrderQuery);
                const paperOrderSnapshot = await getDocs(paperOrderQuery);

                let revenueMap = new Map();

                // Initialize revenueMap with all dates for the last 30 days
                eachDayOfInterval({ start: startDate, end: today }).forEach(date => {
                    const formattedDate = format(date, 'yyyy-MM-dd');
                    revenueMap.set(formattedDate, 0);
                });

                printOrderSnapshot.forEach(doc => {
                    const data = doc.data();
                    const date = format(data.createdAt.toDate(), 'yyyy-MM-dd');
                    const totalPrice = data.totalPrice || 0;
                    revenueMap.set(date, revenueMap.get(date) + totalPrice);
                });

                paperOrderSnapshot.forEach(doc => {
                    const data = doc.data();
                    const date = format(data.timestamp.toDate(), 'yyyy-MM-dd');
                    const price = data.price || 0;
                    revenueMap.set(date, revenueMap.get(date) + price);
                });

                const revenueArray = Array.from(revenueMap, ([date, total]) => ({ date, total }));

                setRevenueData(revenueArray);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu: ", error);
            } finally {
                setLoading(false);
            }
        };

        void fetchData();
    }, [setLoading]);


    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <Layout>
            {loading && <Loader />}
            <div className="p-10">
                <h2 className="text-2xl font-poppins_bold mb-5">Thống kê chỉ số in ấn</h2>
                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded shadow">
                        <h3 className="text-xl font-poppins_bold">Tổng người dùng</h3>
                        <p className="text-3xl font-poppins_light">{stats.totalUsers}</p>
                    </div>
                    <div className="bg-white p-5 rounded shadow">
                        <h3 className="text-xl font-poppins_bold">Tổng đơn đặt in</h3>
                        <p className="text-3xl font-poppins_light">{stats.totalOrders}</p>
                    </div>
                    <div className="bg-white p-5 rounded shadow">
                        <h3 className="text-xl font-poppins_bold">Tổng doanh thu</h3>
                        <p className="text-3xl font-poppins_light">{stats.totalPrice}</p>
                    </div>
                    <div className="bg-white p-5 rounded shadow">
                        <h3 className="text-xl font-poppins_bold">Tổng đơn phản hồi</h3>
                        <p className="text-3xl font-poppins_light">{stats.totalFeedbacks}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-5 rounded shadow mt-5">
                        <h3 className="text-xl font-poppins_bold pb-3">Thống kê máy in</h3>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={printerData}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="printer"/>
                                <YAxis/>
                                <Tooltip/>
                                <Legend/>
                                <Bar dataKey="count">
                                    {printerData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-white p-5 rounded shadow mt-5">
                        <h3 className="text-xl font-poppins_bold pb-3">Thống kê trải nghiệm người dùng</h3>
                        <ResponsiveContainer width="100%" height={400}>
                            <PieChart>
                                <Pie data={emotionData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                                     outerRadius={150} fill="#82ca9d" label>
                                    {emotionData.map((entry, index) => (
                                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]}/>
                                    ))}
                                </Pie>
                                <Tooltip/>
                                <Legend/>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="mt-5 text-center">
                            <h3 className="text-xl font-poppins_bold">Điểm trải nghiệm người dùng</h3>
                            <p className="text-3xl font-poppins_light">{stats.averageEmotion.toFixed(2)}/5</p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded shadow mt-5">
                        <h3 className="text-xl font-poppins_bold pb-3">Thống kê tần suất máy gặp báo lỗi</h3>
                        <ResponsiveContainer width="100%" height={400}>
                            <PieChart>
                                <Pie data={feedbackPrinterData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                                     outerRadius={150} fill="#ffc658" label>
                                    {feedbackPrinterData.map((entry, index) => (
                                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]}/>
                                    ))}
                                </Pie>
                                <Tooltip/>
                                <Legend/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-white p-5 rounded shadow mt-5">
                        <h2 className="text-xl font-poppins_bold pb-3">Thống kê doanh thu 30 ngày qua</h2>
                        <div className="bg-white p-5">
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="date"/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Legend/>
                                    <Line type="monotone" dataKey="total" stroke="#8884d8"/>
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                </div>
        </Layout>
);
};

export default AnalyticsManage;