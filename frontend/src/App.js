import './App.css';
import {BrowserRouter, Routes, Route} from "react-router";

import {FirebaseDatabaseProvider} from '@react-firebase/database'
import ViewAndManageItems from './components/ViewAndManageItems';
import RestaurantHeader from './components/RestaurantHeader';
import ViewSales from './components/ViewSales';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
function App() {
  return (
    <FirebaseDatabaseProvider>
      <BrowserRouter>
          <RestaurantHeader />
        <Routes>
          <Route path="/" exact Component={Login}/>
          <Route path="/items" exact element={<ProtectedRoute><ViewAndManageItems/></ProtectedRoute>}/>
          <Route path="/sales" exact element={<ProtectedRoute><ViewSales/></ProtectedRoute>}/>
        </Routes>
      </BrowserRouter>
    </FirebaseDatabaseProvider>
  );
}

export default App;
