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

  // 🔐 LOGIN FUNCTION
  const setAuthData = (token, role) => {
    setAuth({ token, role });
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
  };

  // 🔓 LOGOUT FUNCTION (VERY IMPORTANT FIX)
  const logout = () => {
    setAuth({
      token: null,
      role: null
    });

    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // clear sensitive data
    setCategories([]);
    setItems([]);
    setCartItems([]);
  };

  // ✅ LOAD DATA ONLY IF LOGGED IN
  useEffect(() => {
    if (!auth.token) return;

    async function loadData() {
      try {
        const [categoriesResponse, itemsResponse] = await Promise.all([
          fetchCategories(),
          fetchItems()
        ]);

        setCategories(categoriesResponse.data);
        setItems(itemsResponse.data);

      } catch (error) {
        console.error("Failed to load data", error);
      }
    }

    loadData();
  }, [auth.token]);

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
    logout
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );

  // -----------------------------
  // CART FUNCTIONS
  // -----------------------------

  function addToCart(item) {
    setCartItems(prevCart => {
      const existingItem = prevCart.find(
        cartItem => cartItem.name === item.name
      );

      const priceValue = item.price ?? 0;

      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.name === item.name
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [
          ...prevCart,
          {
            name: item.name,
            price: Number(priceValue),
            quantity: 1
          }
        ];
      }
    });
  }

  function increaseQuantity(name) {
    setCartItems(prevCart =>
      prevCart.map(item =>
        item.name === name
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  function decreaseQuantity(name) {
    setCartItems(prevCart =>
      prevCart
        .map(item =>
          item.name === name
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  }

  function removeItem(name) {
    setCartItems(prevCart =>
      prevCart.filter(item => item.name !== name)
    );
  }

  function clearCart() {
    setCartItems([]);
  }
};