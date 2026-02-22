import { useContext } from 'react';
import './Cartitems.css';
import { AppContext } from '../Context/AppContext';

const Cartitems = () => {
    const { cartItems, increaseQuantity, decreaseQuantity, removeItem } = useContext(AppContext);

    return (
        <div className="cart-items-list">
            {cartItems.length === 0 ? (
                <p className="text-light">Your cart is empty.</p>
            ) : (
                cartItems.map((item) => (
                    <div key={item.id} className="cart-item">

                        <div className="item-header">
                            <span>{item.name}</span>
                            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>

                        <div className="item-controls">
                            <div className="qty-controls">
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => decreaseQuantity(item.id)}  // ✅ was item.name
                                    disabled={item.quantity === 1}
                                >
                                    -
                                </button>

                                <span>{item.quantity}</span>

                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => increaseQuantity(item.id)}  // ✅ was item.name
                                >
                                    +
                                </button>
                            </div>

                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => removeItem(item.id)}            // ✅ was item.name
                            >
                                🗑
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Cartitems;