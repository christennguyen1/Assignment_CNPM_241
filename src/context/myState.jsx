import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import MyContext from './myContext';

function MyState({ children }) {
    const [loading, setLoading] = useState(false);

    const contextValue = useMemo(() => ({
        loading,
        setLoading,
    }), [loading]);

    return (
        <MyContext.Provider value={contextValue}>
            {children}
        </MyContext.Provider>
    )
}

MyState.propTypes = {
    children: PropTypes.node.isRequired,
};

export default MyState;