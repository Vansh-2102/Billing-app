import { createContext, useEffect, useState } from "react";
import { fetchCategories } from "../Service/CategoryService";
import { fetchItems } from "../Service/ItemService";

export const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {

  // ========================
  // STATE
  // ========================
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  const [auth, setAuth] = useState({
    token: localStorage.getItem("token") || null,
    role: localStorage.getItem("role") || null,
  });

  // ========================
  // AUTH FUNCTIONS
  // ========================
  const setAuthData = (token, role) => {
    setAuth({ token, role });
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
  };

  const logout = () => {
    setAuth({ token: null, role: null });
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // Reset app state
    setCategories([]);
    setItems([]);
    setCartItems([]);
  };

  // ========================
  // LOAD DATA AFTER LOGIN
  // ========================
  useEffect(() => {
    if (!auth.token) return;

    const loadData = async () => {
      try {
        const [categoriesResponse, itemsResponse] = await Promise.all([
          fetchCategories(),
          fetchItems(),
        ]);

        setCategories(categoriesResponse.data);
        setItems(itemsResponse.data);
      } catch (error) {
        console.error("Failed to load data", error);

        // Optional: auto logout on 401
        if (error.response?.status === 401) {
          logout();
        }
      }
    };

    loadData();
  }, [auth.token]);

  // ========================
  // CART LOGIC
  // ========================
  const addToCart = (item) => {
    const priceValue = parseFloat(item.price) || 0;
    const uniqueKey = item.itemId ?? item.id ?? item._id ?? item.name;

    setCartItems((prevCart) => {
      const existingItem = prevCart.find((c) => c.id === uniqueKey);

      if (existingItem) {
        return prevCart.map((c) =>
          c.id === uniqueKey
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      }

      return [
        ...prevCart,
        {
          id: uniqueKey,
          name: item.name,
          price: priceValue,
          quantity: 1,
        },
      ];
    });
  };

  const increaseQuantity = (id) => {
    setCartItems((prevCart) =>
      prevCart.map((c) =>
        c.id === id ? { ...c, quantity: c.quantity + 1 } : c
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems((prevCart) =>
      prevCart
        .map((c) =>
          c.id === id ? { ...c, quantity: c.quantity - 1 } : c
        )
        .filter((c) => c.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCartItems((prevCart) =>
      prevCart.filter((c) => c.id !== id)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // ========================
  // CONTEXT VALUE
  // ========================
  const contextValue = {
    categories,
    setCategories,
    items,
    setItems,
    cartItems,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
    auth,
    setAuthData,
    logout,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};