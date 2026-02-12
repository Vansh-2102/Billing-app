import React, { useContext, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import "./Explorer.css";

import DisplayCategory from "../../DisplayCategory/DisplayCategory";
import DisplayItems from "../../DisplayItems/DisplayItem"
import CustomerForm from "../../CustomerForm/CustomerForm";
import CartItems from "../../Cartitems/CartItems";
import CartSummary from "../../CartSummary/CartSummary";

const Explore = () => {
  const { categories, items } = useContext(AppContext);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  // calculate item count per category
  const categoriesWithCount = categories.map((cat) => ({
    ...cat,
    numberOfItems: items.filter(
      (item) => item.categoryId === cat.categoryId
    ).length,
  }));

  return (
    <div className="explore-container text-light">
      <div className="left-column">
        <div className="first-row" style={{ overflowY: "auto" }}>

          <DisplayCategory
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categoriesWithCount}
          />

        </div>

        <hr className="horizontal-line" />

        <div className="second-row" style={{ overflowY: "auto" }}>
          <DisplayItems selectedCategory={selectedCategory} />
        </div>
      </div>

      <div className="right-column d-flex flex-column">
        <div className="customer-form-container" style={{ height: "15%" }}>
          <CustomerForm 
            customerName={customerName}
            mobileNumber={setMobileNumber}
            setMobileNumber={setMobileNumber}
            setCustomerName={setCustomerName}
          />
        </div>

        <hr className="my-3 text-light" />

        <div
          className="cart-items-container"
          style={{ height: "55%", overflowY: "auto" }}
        >
          <CartItems />
        </div>

        <div className="cart-summary-container" style={{ height: "30%" }}>
          <CartSummary />
        </div>
      </div>
    </div>
  );
};

export default Explore;
