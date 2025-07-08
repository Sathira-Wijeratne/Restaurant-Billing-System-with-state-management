import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import {useDispatch, useSelector} from 'react-redux';
import {verifyAuth} from '../store/authSlice';
import {CircularProgress, Box} from '@mui/material';

const ProtectedRoute = ({ children }) => {
    const dispatch = useDispatch();
    const {isAuthenticated, loading} = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(verifyAuth()); // what does this do?
    }, [dispatch]);

    if (loading) {
        return (
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: 2, zIndex: 1400 }}>
                <CircularProgress></CircularProgress>
            </Box>
        );
    }

    return isAuthenticated ? children : <Navigate to="/" replace/>;
};

export default ProtectedRoute;