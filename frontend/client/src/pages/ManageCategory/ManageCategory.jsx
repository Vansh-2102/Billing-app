// src/pages/ManageCategory/ManageCategory.jsx
import React from "react";
import "./ManageCategory.css";
import CategoryForms from "../../Components/CategoryForm/CategoryForm";
import CategoryList from "../../Components/CategoryList/CategoryList";

const ManageCategory = () => {
  return (
    <div className="mc-page">             {/* root for this screen */}
      <div className="mc-inner">
        <div className="mc-left">
          <CategoryForms />
        </div>

        <div className="mc-right">
          <CategoryList />
        </div>
      </div>
    </div>
  );
};

export default ManageCategory;
