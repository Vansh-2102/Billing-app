import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../Context/AppContext";
import { assets } from "../../assets/assets";
import "./Menubar.css";

const Menubar = () => {

  const { auth, logout } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout(); // 🔥 IMPORTANT
    navigate("/login", { replace: true });
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-2">

      {/* Logo */}
      <Link className="navbar-brand" to="/dashboard">
        <img src={assets.logo} alt="Logo" height="40" />
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse p-2" id="navbarNav">
        <ul className="navbar-nav me-auto">

          <li className="nav-item">
            <Link
              className={`nav-link ${isActive('/dashboard') ? 'fw-bold text-warning' : ''}`}
              to="/dashboard"
            >
              Dashboard
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className={`nav-link ${isActive('/explore') ? 'fw-bold text-warning' : ''}`}
              to="/explore"
            >
              Explore
            </Link>
          </li>

          {auth.role === "ADMIN" && (
            <>
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive('/items') ? 'fw-bold text-warning' : ''}`}
                  to="/items"
                >
                  Manage Items
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive('/category') ? 'fw-bold text-warning' : ''}`}
                  to="/category"
                >
                  Manage Categories
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive('/users') ? 'fw-bold text-warning' : ''}`}
                  to="/users"
                >
                  Manage Users
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive('/orders') ? 'fw-bold text-warning' : ''}`}
                  to="/orders"
                >
                  Order History
                </Link>
              </li>
            </>
          )}

        </ul>

        <div className="d-flex align-items-center">
          <span className="text-light me-3">
            Role: {auth.role || "N/A"}
          </span>

          <button
            className="btn btn-outline-light btn-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Menubar;