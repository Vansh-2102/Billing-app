import React, { useContext, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import "./Explorer.css";

import DisplayCategory from "../../DisplayCategory/DisplayCategory";
import DisplayItems from "../../DisplayItems/DisplayItem";
import CustomerForm from "../../CustomerForm/CustomerForm";
import CartItems from "../../Cartitems/CartItems";
import CartSummary from "../../CartSummary/CartSummary";

const Explore = () => {
  const { categories, items } = useContext(AppContext);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  const categoriesWithCount = categories.map((cat) => ({
    ...cat,
    numberOfItems: items.filter(
      (item) => item.categoryId === cat.categoryId
    ).length,
  }));

  return (
    <div className="explore-container text-light">

      {/* LEFT SIDE */}
      <div className="left-column">
        <div className="first-row">
          <DisplayCategory
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categoriesWithCount}
          />
        </div>

        <hr className="horizontal-line" />

        <div className="second-row">
          <DisplayItems selectedCategory={selectedCategory} />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="right-column">

        <div className="customer-form-container">
          <CustomerForm
            customerName={customerName}
            mobileNumber={mobileNumber}
            setMobileNumber={setMobileNumber}
            setCustomerName={setCustomerName}
          />
        </div>

        <hr className="my-3 text-light" />

        <div className="cart-items-container">
          <CartItems />
        </div>

        <div className="cart-summary-wrapper">
          <CartSummary
            customerName={customerName}
            mobileNumber={mobileNumber}
          />
        </div>

      </div>
    </div>
  );
};

export default Explore;
