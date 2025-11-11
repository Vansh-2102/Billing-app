import { Routes, Route } from "react-router-dom";
import Menubar from './Components/Menubar/Menubar.jsx';
import Explore from './pages/Explore/Explore.jsx';
import ManageCategory from './pages/ManageCategory/ManageCategory.jsx';
import ManageItems from './pages/ManageItems/ManageItems.jsx';
import ManageUsers from './pages/ManageUsers/ManageUsers.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx'; // ✅ Make sure this file exists

const App = () => {
  return (
    <div>
      <Menubar />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/category" element={<ManageCategory />} /> {/* ✅ fixed typo */}
        <Route path="/users" element={<ManageUsers />} />
        <Route path="/items" element={<ManageItems />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </div>
  );
};

export default App;
