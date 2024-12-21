import Layout from "../components/layout/Layout.jsx";
import Logo from "../assets/avatar.jpg";

const Dashboard = () => {
    // user
    const user = JSON.parse(localStorage.getItem('users'));

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
                    <div className="bg-[#f5f5f5] py-5 rounded-xl">
                        {/* image */}
                        <div className="flex justify-center">
                            <img className="w-52 h-52 rounded-full" src={Logo} alt="img"/>
                        </div>
                        {/* text  */}
                        <div className="items-center flex flex-col pt-5">
                            <div className="grid grid-cols-2 gap-x-0 gap-y-4 ml-14 text-left">
                                {/* Name  */}
                                <span className="font-poppins_semibold">Họ tên:</span>
                                <span>{user?.name}</span>

                                {/* Email  */}
                                <span className="font-poppins_semibold">Email:</span>
                                <span>{user?.email}</span>

                                {/* Date  */}
                                <span className="font-poppins_semibold">Ngày:</span>
                                <span>{new Date(user?.date).toLocaleDateString('vi-VN')}</span>

                                {/* Role  */}
                                <span className="font-poppins_semibold">Vai trò:</span>
                                <span>{getRoleDisplayName(user?.role)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Dashboard;