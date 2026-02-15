import { useContext, useState } from "react";
import { AppContext } from "../Context/AppContext";
import ReceiptPopup from "../Components/ReceiptPopup/ReceiptPopup";
import { toast } from "react-toastify";

import { createOrder, deleteOrder } from "../Service/OrderService";
import { createRazorpayOrder, verifyPayment } from "../Service/PaymentService";
import AppConstants from "../util/constants";

import "./CartSummary.css";

const CartSummary = ({ customerName, mobileNumber }) => {
    const { cartItems, clearCart } = useContext(AppContext);

    const [isProcessing, setIsProcessing] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    const totalAmount = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const tax = totalAmount * 0.18;
    const grandTotal = totalAmount + tax;

    const handlePrintReceipt = () => {
        window.print();
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const deleteOrderOnFailure = async (orderId) => {
        try {
            await deleteOrder(orderId);
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    const completePayment = async (paymentMode) => {
        if (!customerName || !mobileNumber) {
            toast.error("Please enter customer details");
            return;
        }

        if (cartItems.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        const orderData = {
            customerName,
            phoneNumber: mobileNumber,
            cartItems,
            subtotal: totalAmount,
            tax,
            grandTotal,
            paymentMethod: paymentMode.toUpperCase(),
        };

        setIsProcessing(true);

        try {
            const response = await createOrder(orderData);
            const saveData = response.data;

            // CASH PAYMENT
            if (response.status === 201 && paymentMode === "cash") {
                toast.success("Cash received");
                setOrderDetails(saveData);   // save order
                clearCart();                 // clear cart
                return;
            }

            // UPI PAYMENT
            if (response.status === 201 && paymentMode === "upi") {
                const razorpayLoaded = await loadRazorpayScript();

                if (!razorpayLoaded) {
                    toast.error("Unable to load Razorpay");
                    await deleteOrderOnFailure(saveData.orderId);
                    return;
                }

                const razorpayResponse = await createRazorpayOrder({
                    amount: grandTotal,
                    currency: "INR",
                });

                const options = {
                    key: AppConstants.RAZORPAY_KEY_ID,
                    amount: razorpayResponse.data.amount,
                    currency: razorpayResponse.data.currency,
                    order_id: razorpayResponse.data.id,
                    name: "My Retail Shop",
                    description: "Order Payment",

                    handler: function (response) {
                        verifyPaymentHandler(response, saveData);
                    },

                    prefill: {
                        name: customerName,
                        contact: mobileNumber,
                    },

                    theme: {
                        color: "#3399cc",
                    },
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            }
        } catch (error) {
            toast.error("Payment processing failed");
        } finally {
            setIsProcessing(false);
        }
    };

    const verifyPaymentHandler = async (response, saveOrder) => {
        const payment = {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            orderId: saveOrder.orderId,
        };

        try {
            const paymentResponse = await verifyPayment(payment);

            if (
                paymentResponse.status === 200 ||
                paymentResponse.status === 201
            ) {
                toast.success("Payment successful");

                const finalOrder = {
                    ...saveOrder,
                    paymentDetails: payment,
                };

                setOrderDetails(finalOrder); // only save
                clearCart();                 // clear cart
            } else {
                toast.error("Payment verification failed");
            }
        } catch (err) {
            console.log(err);
            toast.error("Payment failed");
        }
    };

    return (
        <div className="summary-footer p-3 border-top">
            <div className="d-flex justify-content-between mb-2">
                <span className="text-light">Items:</span>
                <span className="text-light">₹{totalAmount.toFixed(2)}</span>
            </div>

            <div className="d-flex justify-content-between mb-2">
                <span className="text-light">Tax (18%):</span>
                <span className="text-light">₹{tax.toFixed(2)}</span>
            </div>

            <div className="d-flex justify-content-between mb-3 fw-bold">
                <span className="text-light">Total:</span>
                <span className="text-light">₹{grandTotal.toFixed(2)}</span>
            </div>

            <div className="d-flex gap-2 mb-2">
                <button
                    className="btn btn-success flex-grow-1"
                    onClick={() => completePayment("cash")}
                    disabled={isProcessing}
                >
                    Cash
                </button>

                <button
                    className="btn btn-primary flex-grow-1"
                    onClick={() => completePayment("upi")}
                    disabled={isProcessing}
                >
                    UPI
                </button>
            </div>

            {/* PLACE ORDER BUTTON */}
            <button
                className="btn btn-warning w-100"
                onClick={() => {
                    if (!orderDetails) {
                        toast.error("Complete payment first");
                        return;
                    }
                    setShowPopup(true);
                }}
                disabled={isProcessing}
            >
                Place Order
            </button>

            {showPopup && orderDetails && (
                <ReceiptPopup
                    orderDetails={{
                        ...orderDetails,
                        razorpayOrderId:
                            orderDetails.paymentDetails?.razorpayOrderId,
                        razorpayPaymentId:
                            orderDetails.paymentDetails?.razorpayPaymentId,
                    }}
                    onClose={() => setShowPopup(false)}
                    onPrint={handlePrintReceipt}
                />
            )}
        </div>
    );
};

export default CartSummary;
