import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import NoPage from "./pages/noPage/NoPage";
import ProductInfo from "./pages/productInfo/ProductInfo";
import ScrollTop from "./components/scrollTop/ScrollTop";
import Cart from "./pages/cart/Cart";
import PrintRequest from "./pages/user/print-request/PrintRequest.jsx";
import AboutUs from  "./pages/about-us/AboutUs.jsx";
import ErrorReport from "./pages/user/error-report/ErrorReport.jsx";
import PrintManage from "./pages/admin/print-manage/PrintManage.jsx";
import ErrorManage from "./pages/admin/error-manage/ErrorManage.jsx";
import Signup from "./pages/registration/Signup";
import Login from "./pages/registration/Login";
import UserDashboard from "./pages/user/UserDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddProductPage from "./pages/admin/AddProductPage";
import UpdateProductPage from "./pages/admin/UpdateProductPage";
import MyState from "./context/myState";
import { Toaster } from "react-hot-toast";
import { ProtectedRouteForUser } from "./protectedRoute/ProtectedRouteForUser";
import { ProtectedRouteForAdmin } from "./protectedRoute/ProtectedRouteForAdmin";
import CategoryPage from "./pages/category/CategoryPage";

const App = () => {
  return (
    <MyState>
      <Router>
        <ScrollTop />
        <Routes>
          <Route path="/1" element={<Cart />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/*" element={<NoPage />} />
          <Route path="/productinfo/:id" element={<ProductInfo />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/print-request" element={
            <ProtectedRouteForUser>
              <PrintRequest />
            </ProtectedRouteForUser>
          } />
          <Route path="/error-report" element={
            <ProtectedRouteForUser>
              <ErrorReport/>
            </ProtectedRouteForUser>
          } />
          <Route path="/print-manage" element={
            <ProtectedRouteForAdmin>
              <PrintManage/>
            </ProtectedRouteForAdmin>
          } />
          <Route path="/error-manage" element={
            <ProtectedRouteForAdmin>
              <ErrorManage/>
            </ProtectedRouteForAdmin>
          } />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/log-in" element={<Login />} />
          <Route path="/category/:categoryname" element={<CategoryPage />} />  {/* category Page route  */}
          <Route path="/user-dashboard" element={
            <ProtectedRouteForUser>
              <UserDashboard/>
            </ProtectedRouteForUser>
          } />
          <Route path="/admin-dashboard" element={
            <ProtectedRouteForAdmin>
              <AdminDashboard/>
            </ProtectedRouteForAdmin>
          } />
          <Route path="/addproduct" element={
            <ProtectedRouteForAdmin>
              <AddProductPage/>
            </ProtectedRouteForAdmin>
          } />
          <Route path="/updateproduct/:id" element={
            <ProtectedRouteForAdmin>
              <UpdateProductPage/>
            </ProtectedRouteForAdmin>
          } />
        </Routes>
        <Toaster/>
      </Router>
    </MyState>
  );
}

export default App;
