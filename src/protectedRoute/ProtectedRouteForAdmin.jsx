import PropTypes from 'prop-types';
import { Navigate } from 'react-router';

export const ProtectedRouteForAdmin = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('users'));
    if (user?.role === "admin") {
        return children;
    } else {
        return <Navigate to={'/log-in'} />;
    }
};

ProtectedRouteForAdmin.propTypes = {
    children: PropTypes.node.isRequired,
};