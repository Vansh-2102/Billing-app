import "./ReceiptPopup.css";
import "./Print.css";

const ReceiptPopup = ({ orderDetails, onClose, onPrint }) => {

    const fmt = (val) => Number(val || 0).toFixed(2);

    return (
        <div className="receipt-popup-overlay text-dark">
            <div className="receipt-popup">

                <i className="bi bi-check-circle-fill text-success fs-1"></i>

                <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
                <p><strong>Name:</strong> {orderDetails.customerName}</p>
                <p><strong>Phone:</strong> {orderDetails.phoneNumber}</p>

                <hr className="my-3" />
                <h5 className="mb-3">Items Ordered</h5>

                <div className="cart-items-scrollable">
                    {orderDetails.cartItems?.length > 0 ? (
                        orderDetails.cartItems.map((item, index) => (
                            <div key={index} className="d-flex justify-content-between mb-2">
                                <span>{item.name} x{item.quantity}</span>
                                <span>₹{fmt(Number(item.price) * Number(item.quantity))}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted">No items found</p>
                    )}
                </div>

                <hr className="my-3" />

                <div className="d-flex justify-content-between mb-2">
                    <span><strong>Subtotal:</strong></span>
                    <span>₹{fmt(orderDetails.subtotal)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                    <span><strong>Tax (18%):</strong></span>
                    <span>₹{fmt(orderDetails.tax)}</span>
                </div>
                <div className="d-flex justify-content-between mb-4">
                    <span><strong>Grand Total:</strong></span>
                    <span>₹{fmt(orderDetails.grandTotal)}</span>
                </div>

                <p><strong>Payment Method:</strong> {orderDetails.paymentMethod}</p>

                {orderDetails.paymentMethod === "UPI" && (
                    <>
                        <p><strong>Razorpay Order ID:</strong> {orderDetails.razorpayOrderId}</p>
                        <p><strong>Razorpay Payment ID:</strong> {orderDetails.razorpayPaymentId}</p>
                    </>
                )}

                <div className="d-flex justify-content-end gap-3 mt-4">
                    <button className="btn btn-warning" onClick={onPrint}>Print Receipt</button>
                    <button className="btn btn-danger" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default ReceiptPopup;