import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { verifyAuth } from '../store/authSlice';
import { BrowserRouter, Routes, Route } from "react-router";
import { FirebaseDatabaseProvider } from '@react-firebase/database';

import ViewAndManageItems from './ViewAndManageItems';
import RestaurantHeader from './RestaurantHeader';
import ViewSales from './ViewSales';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';

const AppInitializer = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(verifyAuth());
    }, [dispatch]);

    return (
        <FirebaseDatabaseProvider>
            <BrowserRouter>
                <RestaurantHeader />
                <Routes>
                    <Route path="/" exact Component={Login} />
                    <Route path="/items" exact element={<ProtectedRoute><ViewAndManageItems /></ProtectedRoute>} />
                    <Route path="/sales" exact element={<ProtectedRoute><ViewSales /></ProtectedRoute>} />
                    {/* Add other routes here */}
                </Routes>
            </BrowserRouter>
        </FirebaseDatabaseProvider>
    );
};

export default AppInitializer;