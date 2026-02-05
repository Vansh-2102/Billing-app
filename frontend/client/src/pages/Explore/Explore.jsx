import React, { useContext, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import './Expoler.css';

const Explore = () => {
  const { categories, items } = useContext(AppContext);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const filteredItems = selectedCategory
    ? items.filter(item => item.categoryId === selectedCategory)
    : items;

  return (
    <div className="explore-container text-light">
      <div className="left-column">
        <div className="first-row" style={{ overflowY: 'auto' }}>
          <h5 className="mb-3">Categories</h5>
          {categories.length === 0 ? (
            <p className="text-muted">No categories available</p>
          ) : (
            <div className="d-flex flex-wrap gap-2">
              <button
                className={`btn ${!selectedCategory ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setSelectedCategory(null)}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.categoryId}
                  className={`btn ${selectedCategory === category.categoryId ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setSelectedCategory(category.categoryId)}
                  style={{ backgroundColor: selectedCategory === category.categoryId ? category.bgColor : undefined }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <hr className="horizontal-line" />

        <div className="second-row" style={{ overflowY: 'auto' }}>
          <h5 className="mb-3">Items</h5>
          {filteredItems.length === 0 ? (
            <p className="text-muted">No items available</p>
          ) : (
            <div className="row g-2">
              {filteredItems.map((item) => (
                <div key={item.itemId} className="col-12">
                  <div className="card p-2" style={{ backgroundColor: '#2c2c2c' }}>
                    <div className="d-flex align-items-center">
                      <img
                        src={item.imgUrl || 'https://placehold.co/48x48'}
                        alt={item.name}
                        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px', marginRight: '10px' }}
                      />
                      <div className="flex-grow-1">
                        <h6 className="mb-0 text-white">{item.name}</h6>
                        <small className="text-muted">₹{item.price?.toFixed(2) || '0.00'}</small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="right-column d-flex flex-column">
        <div className="customer-form-container" style={{ height: '15%' }}>
          <h6>Customer Form</h6>
          <p className="text-muted small">Coming soon...</p>
        </div>

        <div className="cart-items-container" style={{ height: '55%', overflowY: 'auto' }}>
          <h6>Cart Items</h6>
          <p className="text-muted small">Cart functionality coming soon...</p>
        </div>

        <div className="cart-summary-container" style={{ height: '30%' }}>
          <h6>Cart Summary</h6>
          <p className="text-muted small">Summary coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Explore;
