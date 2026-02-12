import { Routes, Route, useLocation } from "react-router-dom";
import Menubar from './Components/Menubar/Menubar.jsx';
import Explore from './pages/Explore/Explore.jsx';

import ManageCategory from './pages/ManageCategory/ManageCategory.jsx';
import ManageItems from './pages/ManageItems/ManageItems.jsx';
import ManageUsers from './pages/ManageUsers/ManageUsers.jsx';
import Login from './pages/Login/Login.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const location = useLocation();

  return (
    <div>
      {location.pathname !== '/login' && <Menubar />}

      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/category" element={<ManageCategory />} />
        <Route path="/users" element={<ManageUsers />} />
        <Route path="/items" element={<ManageItems />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </div>
  );
};

export default App;
