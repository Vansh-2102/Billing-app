import React, { useContext, useState, useRef } from "react";
import { AppContext } from "../../Context/AppContext";
import ReceiptPopup from "../../Components/ReceiptPopup/ReceiptPopup";
import "./Explorer.css";

import DisplayCategory from "../../DisplayCategory/DisplayCategory";
import DisplayItems from "../../DisplayItems/DisplayItem";
import CustomerForm from "../../CustomerForm/CustomerForm";
import CartItems from "../../Cartitems/Cartitems";
import CartSummary from "../../CartSummary/CartSummary";

const Explore = () => {
  const { categories, items } = useContext(AppContext);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  // ✅ LIFTED UP: orderDetails and showPopup live here in the parent
  // so they survive clearCart() re-renders inside CartSummary
  const [orderDetails, setOrderDetails] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const categoriesWithCount = categories.map((cat) => ({
    ...cat,
    numberOfItems: items.filter(
      (item) => item.categoryId === cat.categoryId
    ).length,
  }));

  const handlePrintReceipt = () => window.print();

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
            orderDetails={orderDetails}
            setOrderDetails={setOrderDetails}
            showPopup={showPopup}
            setShowPopup={setShowPopup}
          />
        </div>
      </div>

      {/* ✅ ReceiptPopup rendered HERE in parent, outside CartSummary
          so it never gets unmounted when cart state changes */}
      {showPopup && orderDetails && (
        <ReceiptPopup
          orderDetails={{
            ...orderDetails,
            razorpayOrderId: orderDetails.paymentDetails?.razorpayOrderId,
            razorpayPaymentId: orderDetails.paymentDetails?.razorpayPaymentId,
          }}
          onClose={() => {
            setShowPopup(false);
            setOrderDetails(null);
          }}
          onPrint={handlePrintReceipt}
        />
      )}
    </div>
  );
};

export default Explore;