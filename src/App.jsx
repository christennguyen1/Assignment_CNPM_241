import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import NoPage from "./pages/noPage/NoPage";
import PrintRequest from "./pages/user/print-request/PrintRequest.jsx";
import AboutUs from  "./pages/about-us/AboutUs.jsx";
import Feedback from "./pages/user/feedback/Feedback.jsx";
import UserManage from "./pages/admin/user-manage/UserManage.jsx";
import PrintManage from "./pages/admin/print-manage/PrintManage.jsx";
import FeedbackManage from "./pages/admin/feedback-manage/FeedbackManage.jsx";
import PrinterManage from "./pages/admin/printer-manage/PrinterManage.jsx";
import AnalyticsManage from "./pages/admin/analytics/AnalyticsManage.jsx";
import Signup from "./pages/registration/Signup";
import Login from "./pages/registration/Login";
import Dashboard from "./pages/Dashboard.jsx";
import MyState from "./context/myState";
import { Toaster } from "react-hot-toast";
import { ProtectedRoute } from "./protectedRoute/ProtectedRoute";
import { ProtectedRouteForUser } from "./protectedRoute/ProtectedRouteForUser";
import { ProtectedRouteForAdmin } from "./protectedRoute/ProtectedRouteForAdmin";

const Logout = () => {
  localStorage.clear('users');
  return <Login />;
};

const App = () => {
  return (
    <MyState>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/*" element={<NoPage />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/print-request" element={
            <ProtectedRouteForUser>
              <PrintRequest />
            </ProtectedRouteForUser>
          } />
          <Route path="/feedback" element={
            <ProtectedRouteForUser>
              <Feedback/>
            </ProtectedRouteForUser>
          } />
          <Route path="/print-manage" element={
            <ProtectedRouteForAdmin>
              <PrintManage/>
            </ProtectedRouteForAdmin>
          } />
          <Route path="/error-manage" element={
            <ProtectedRouteForAdmin>
              <FeedbackManage/>
            </ProtectedRouteForAdmin>
          } />
            <Route path="/printer-manage" element={
                <ProtectedRouteForAdmin>
                <PrinterManage/>
                </ProtectedRouteForAdmin>
            } />
            <Route path="/user-manage" element={
                <ProtectedRouteForAdmin>
                <UserManage/>
                </ProtectedRouteForAdmin>
            } />
            <Route path="/analytics-manage" element={
                <ProtectedRouteForAdmin>
                <AnalyticsManage/>
                </ProtectedRouteForAdmin>
            } />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/log-in" element={<Login />} />
          <Route path="/log-out" element={<Logout />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
          } />
        </Routes>
        <Toaster/>
      </Router>
    </MyState>
  );
}

export default App;
