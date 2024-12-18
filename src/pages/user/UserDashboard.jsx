import { useContext } from "react";
import Layout from "../../components/layout/Layout";
import myContext from "../../context/myContext";
import Loader from "../../components/loader/Loader";
import Logo from "../../assets/Logo.png";

const UserDashboard = () => {
    // user
    const user = JSON.parse(localStorage.getItem('users'));
    const context = useContext(myContext);
    const { loading, getAllOrder } = context;

    const getRoleDisplayName = (role) => {
        switch (role) {
            case 'admin':
                return 'Quản trị viên';
            case 'user':
                return 'Người dùng';
            default:
                return role;
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-5 lg:py-8">
                {/* Top */}
                <div className="top">
                    {/* main */}
                    <div className="bg-gray-200 py-5 rounded-xl border border-black">
                        {/* image */}
                        <div className="flex justify-center">
                            <img className="w-52 h-52 border-black" src={Logo} alt="img"/>
                        </div>
                        {/* text  */}
                        <div className="">
                            {/* Name  */}
                            <h1 className=" text-center text-lg">
                                <span className=" font-bold">Họ tên: </span>
                                {user?.name}
                            </h1>

                            {/* Email  */}
                            <h1 className=" text-center text-lg">
                                <span className=" font-bold">Email: </span>
                                {user?.email}
                            </h1>

                            {/* Date  */}
                            <h1 className=" text-center text-lg">
                                <span className=" font-bold">Ngày: </span>
                                {new Date(user?.date).toLocaleDateString('vi-VN')}
                            </h1>

                            {/* Role  */}
                            <h1 className=" text-center text-lg">
                                <span className=" font-bold">Vai trò: </span>
                                {getRoleDisplayName(user?.role)}
                            </h1>
                        </div>
                    </div>
                </div>

                {/* bottom  */}
                <div className="bottom">
                    {/* main 1 */}
                    <div className="mx-auto my-4 max-w-6xl px-2 md:my-6 md:px-0">
                        {/* text  */}
                        <h2 className=" text-2xl lg:text-3xl font-bold">Lịch sử in gần đây</h2>

                        <div className="flex justify-center relative top-10">
                            {loading && <Loader/>}
                        </div>

                        {/* main 2 */}
                        {getAllOrder.filter((obj) => obj.userid === user?.uid).map((order) => {
                            return (
                            // console.log(order);
                                <div key={order.id}>
                                    {order.cartItems.map((item) => {
                                        // console.log('item', item);
                                        const {id, date, quantity, price, title, productImageUrl, category} = item;
                                        // console.log('order', order)
                                        const {status} = order;
                                        return (
                                            <div key={id}
                                                 className="mt-5 flex flex-col overflow-hidden rounded-xl border border-black md:flex-row">
                                                {/* main 3  */}
                                                <div className="w-full border-r border-back bg-gray-200 md:max-w-xs">
                                                    {/* left  */}
                                                    <div className="p-8">
                                                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-1">
                                                            <div className="mb-4">
                                                                <div className="text-sm font-semibold text-black">Mã giao dịch</div>
                                                                <div className="text-sm font-medium text-gray-800">#{id}</div>
                                                            </div>

                                                            <div className="mb-4">
                                                                <div className="text-sm font-semibold">Ngày</div>
                                                                <div className="text-sm font-medium text-gray-800">{date}</div>
                                                            </div>

                                                            <div className="mb-4">
                                                                <div className="text-sm font-semibold">Tổng số lượng</div>
                                                                <div className="text-sm font-medium text-gray-800">₫ {price * quantity}</div>
                                                            </div>

                                                            <div className="mb-4">
                                                                <div className="text-sm font-semibold">Tình trạng giao dịch</div>
                                                                {status === 'pending' ?
                                                                    <div className="text-sm font-medium text-red-800 first-letter:uppercase">{status}</div>
                                                                    : <div className="text-sm font-medium text-green-800 first-letter:uppercase">{status}</div>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* right  */}
                                                <div className="flex-1">
                                                    <div className="p-8">
                                                        <ul className="-my-7 divide-y divide-gray-200">
                                                            <li className="flex flex-col justify-between space-x-5 py-7 md:flex-row">
                                                                <div className="flex flex-1 items-stretch">
                                                                    <div className="flex-shrink-0">
                                                                        <img className="h-40 w-40 rounded-lg border border-black object-contain"
                                                                             src={productImageUrl}
                                                                             alt="img"/>
                                                                    </div>

                                                                    <div className="ml-5 flex flex-col justify-between">
                                                                        <div className="flex-1">
                                                                            <p className="text-sm font-bold text-gray-800">{title}</p>
                                                                            <p className="mt-1.5 text-sm font-medium text-gray-500">{category}</p>
                                                                        </div>

                                                                        <p className="mt-4 text-sm font-medium text-gray-500">x {quantity}</p>
                                                                    </div>
                                                                </div>

                                                                <div className="ml-auto flex flex-col items-end justify-between">
                                                                    <p className="text-right text-sm font-bold text-gray-900">₫ {price}</p>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}

                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default UserDashboard;

