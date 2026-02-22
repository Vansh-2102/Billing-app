import { useContext, useRef } from "react";
import { AppContext } from "../Context/AppContext";
import { toast } from "react-toastify";

import { createOrder, deleteOrder } from "../Service/OrderService";
import { createRazorpayOrder, verifyPayment } from "../Service/PaymentService";
import AppConstants from "../util/constants";

import "./CartSummary.css";

const CartSummary = ({
  customerName,
  mobileNumber,
  orderDetails,
  setOrderDetails,
  setShowPopup,
}) => {
  const { cartItems } = useContext(AppContext);

  const cartRef = useRef(cartItems);
  cartRef.current = cartItems;

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  const tax = subtotal * 0.18;
  const grandTotal = subtotal + tax;
  const finalAmount = Number(grandTotal.toFixed(2));

  const buildOrderDetails = (apiData, paymentDetails = null) => {
    return {
      ...apiData,
      cartItems: apiData.cartItems || cartRef.current,
      subtotal: apiData.subtotal ?? subtotal,
      tax: apiData.tax ?? tax,
      grandTotal: apiData.grandTotal ?? finalAmount,
      customerName: apiData.customerName || customerName,
      phoneNumber: apiData.phoneNumber || mobileNumber,
      paymentDetails,
    };
  };

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const completePayment = async (mode) => {
    if (!customerName || !mobileNumber)
      return toast.error("Enter customer details");

    if (cartItems.length === 0)
      return toast.error("Cart is empty");

    if (finalAmount < 1)
      return toast.error("Minimum ₹1 required");

    const orderData = {
      customerName,
      phoneNumber: mobileNumber,
      cartItems,
      subtotal: Number(subtotal.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      grandTotal: finalAmount,
      paymentMethod: mode.toUpperCase(),
    };

    try {
      const response = await createOrder(orderData);
      const savedOrder = response.data;

      if (mode === "cash") {
        toast.success("Cash received");
        setOrderDetails(buildOrderDetails(savedOrder));
        return;
      }

      if (mode === "upi") {
        const loaded = await loadRazorpayScript();
        if (!loaded) return toast.error("Razorpay failed to load");

        const razorOrder = await createRazorpayOrder({
          amount: finalAmount,
          currency: "INR",
        });

        const options = {
          key: AppConstants.RAZORPAY_KEY_ID,
          amount: razorOrder.data.amount,
          currency: razorOrder.data.currency,
          order_id: razorOrder.data.id,
          name: "My Retail Shop",
          description: "Order Payment",
          handler: (response) =>
            verifyPaymentHandler(response, savedOrder),
          prefill: {
            name: customerName,
            contact: mobileNumber,
          },
          theme: { color: "#3399cc" },
        };

        new window.Razorpay(options).open();
      }
    } catch (err) {
      console.error(err);
      toast.error("Payment failed");
    }
  };

  const verifyPaymentHandler = async (response, savedOrder) => {
    const payment = {
      razorpayOrderId: response.razorpay_order_id,
      razorpayPaymentId: response.razorpay_payment_id,
      razorpaySignature: response.razorpay_signature,
      orderId: savedOrder.orderId,
    };

    try {
      const verifyRes = await verifyPayment(payment);

      if (verifyRes.status === 200 || verifyRes.status === 201) {
        toast.success("Payment successful");
        setOrderDetails(buildOrderDetails(savedOrder, payment));
      } else {
        toast.error("Verification failed");
      }
    } catch (err) {
      toast.error("Payment verification error");
    }
  };

  const handlePlaceOrder = () => {
    if (!orderDetails)
      return toast.error("Complete payment first");

    setShowPopup(true);
  };

  return (
    <div className="summary-footer p-3 border-top">
      <div className="d-flex justify-content-between">
        <span>Items:</span>
        <span>₹{subtotal.toFixed(2)}</span>
      </div>

      <div className="d-flex justify-content-between">
        <span>Tax (18%):</span>
        <span>₹{tax.toFixed(2)}</span>
      </div>

      <div className="d-flex justify-content-between fw-bold">
        <span>Total:</span>
        <span>₹{finalAmount.toFixed(2)}</span>
      </div>

      <div className="d-flex gap-2 mt-3">
        <button
          className="btn btn-success flex-grow-1"
          onClick={() => completePayment("cash")}
          disabled={!!orderDetails}
        >
          Cash
        </button>

        <button
          className="btn btn-primary flex-grow-1"
          onClick={() => completePayment("upi")}
          disabled={!!orderDetails}
        >
          UPI
        </button>
      </div>

      <button
        className="btn btn-warning w-100 mt-2"
        onClick={handlePlaceOrder}
      >
        Place Order
      </button>
    </div>
  );
};

export default CartSummary;