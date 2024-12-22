import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export const ProtectedRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('users'));
    if (user?.role) {
        return children;
    } else {
        return <Navigate to={'/log-in'} />;
    }
};


ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};