import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "./Context/AppContext.jsx";

import Menubar from "./Components/Menubar/Menubar.jsx";
import Explore from "./pages/Explore/Explore.jsx";
import ManageCategory from "./pages/ManageCategory/ManageCategory.jsx";
import ManageItems from "./pages/ManageItems/ManageItems.jsx";
import ManageUsers from "./pages/ManageUsers/ManageUsers.jsx";
import Login from "./pages/Login/Login.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import OrderHistory from "./pages/OrderHistory/OrderHistory.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFound from "./pages/NotFound/NotFound.jsx";

const App = () => {
  const location = useLocation();
  const { auth } = useContext(AppContext);

  // 🔐 Prevent logged-in user from opening login page
  const LoginRoute = ({ element }) => {
    if (auth.token) {
      return <Navigate to="/dashboard" replace />;
    }
    return element;
  };

  // 🔒 Protect routes
  const ProtectedRoute = ({ element, allowedRoles }) => {
    if (!auth.token) {
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(auth.role)) {
      return <Navigate to="/dashboard" replace />;
    }

    return element;
  };

  return (
    <div>
      {/* Hide Menubar on Login page */}
      {location.pathname !== "/login" && <Menubar />}

      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        {/* Public Route */}
        <Route
          path="/login"
          element={<LoginRoute element={<Login />} />}
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Dashboard />} />}
        />

        <Route
          path="/explore"
          element={<ProtectedRoute element={<Explore />} />}
        />

        <Route
          path="/orders"
          element={<ProtectedRoute element={<OrderHistory />} />}
        />

        {/* Admin Only Routes */}
        <Route
          path="/category"
          element={
            <ProtectedRoute
              element={<ManageCategory />}
              allowedRoles={["ADMIN"]}
            />
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute
              element={<ManageUsers />}
              allowedRoles={["ADMIN"]}
            />
          }
        />

        <Route
          path="/items"
          element={
            <ProtectedRoute
              element={<ManageItems />}
              allowedRoles={["ADMIN"]}
            />
          }
        />

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Catch All Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;