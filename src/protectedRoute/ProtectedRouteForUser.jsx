import PropTypes from 'prop-types';
import { Navigate } from "react-router"

export const ProtectedRouteForUser = ({children}) => {
    const user = JSON.parse(localStorage.getItem('users'))
    if (user?.role === "user") {
      return children
    }
    else {
      return <Navigate to={'/log-in'}/>
    }
}

ProtectedRouteForUser.propTypes = {
    children: PropTypes.node.isRequired
}