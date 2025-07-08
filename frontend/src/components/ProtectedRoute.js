import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import {useDispatch, useSelector} from 'react-redux';
import {verifyAuth} from '../store/authSlice';

const ProtectedRoute = ({ children }) => {
    const dispatch = useDispatch();
    const {isAuthenticated, loading} = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(verifyAuth()); // what does this do?
    }, [dispatch]);

    if (loading) {
        return <div>Verifying authentication...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/" replace/>;
};

export default ProtectedRoute;