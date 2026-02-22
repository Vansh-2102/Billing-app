import { createContext, useEffect, useState } from "react";
import { fetchCategories } from "../Service/CategoryService";
import { fetchItems } from "../Service/ItemService";

export const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {

  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  const [auth, setAuth] = useState({
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role"),
  });

  const setAuthData = (token, role) => {
    setAuth({ token, role });
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
  };

  const logout = () => {
    setAuth({ token: null, role: null });
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setCategories([]);
    setItems([]);
    setCartItems([]);
  };

  useEffect(() => {
    if (!auth.token) return;
    async function loadData() {
      try {
        const [categoriesResponse, itemsResponse] = await Promise.all([
          fetchCategories(),
          fetchItems(),
        ]);
        setCategories(categoriesResponse.data);
        setItems(itemsResponse.data);
      } catch (error) {
        console.error("Failed to load data", error);
      }
    }
    loadData();
  }, [auth.token]);

  // ✅ addToCart: stores item with a stable unique key
  const addToCart = (item) => {
    const priceValue = parseFloat(item.price) || 0;
    // ✅ uniqueKey: prefer itemId (passed from Item.jsx), then id/_id, then name
    const uniqueKey = item.itemId ?? item.id ?? item._id ?? item.name;

    setCartItems((prevCart) => {
      const existingItem = prevCart.find((c) => c.id === uniqueKey);
      if (existingItem) {
        return prevCart.map((c) =>
          c.id === uniqueKey ? { ...c, quantity: c.quantity + 1 } : c
        );
      } else {
        return [...prevCart, { id: uniqueKey, name: item.name, price: priceValue, quantity: 1 }];
      }
    });
  };

  // ✅ All cart operations use c.id consistently
  const increaseQuantity = (id) => {
    setCartItems((prevCart) =>
      prevCart.map((c) => c.id === id ? { ...c, quantity: c.quantity + 1 } : c)
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems((prevCart) =>
      prevCart
        .map((c) => c.id === id ? { ...c, quantity: c.quantity - 1 } : c)
        .filter((c) => c.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCartItems((prevCart) => prevCart.filter((c) => c.id !== id));
  };

  const clearCart = () => setCartItems([]);

  const contextValue = {
    categories, setCategories,
    items, setItems,
    cartItems,
    addToCart, increaseQuantity, decreaseQuantity, removeItem, clearCart,
    auth, setAuthData, logout,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};