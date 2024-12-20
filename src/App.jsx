import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import NoPage from "./pages/noPage/NoPage";
import ScrollTop from "./components/scrollTop/ScrollTop";
import PrintRequest from "./pages/user/print-request/PrintRequest.jsx";
import AboutUs from  "./pages/about-us/AboutUs.jsx";
import ErrorReport from "./pages/user/error-report/ErrorReport.jsx";
import PrintManage from "./pages/admin/print-manage/PrintManage.jsx";
import ErrorManage from "./pages/admin/error-manage/ErrorManage.jsx";
import Signup from "./pages/registration/Signup";
import Login from "./pages/registration/Login";
import UserDashboard from "./pages/user/UserDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import MyState from "./context/myState";
import { Toaster } from "react-hot-toast";
import { ProtectedRouteForUser } from "./protectedRoute/ProtectedRouteForUser";
import { ProtectedRouteForAdmin } from "./protectedRoute/ProtectedRouteForAdmin";

const App = () => {
  return (
    <MyState>
      <Router>
        <ScrollTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/*" element={<NoPage />} />
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
        </Routes>
        <Toaster/>
      </Router>
    </MyState>
  );
}

export default App;
