import { createContext, useEffect, useState } from "react";
import { fetchCategories } from "../Service/CategoryService";
import { fetchItems } from "../Service/ItemService";

export const AppContext = createContext(null);

export const AppContextProvider = (props) => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role"),
  });
  const [cartItems, setCartItems] = useState([]);

  // ✅ ADD TO CART
  const addToCart = (item) => {
  setCartItems(prevCart => {
    const existingItem = prevCart.find(
      cartItem => cartItem.name === item.name
    );

    const priceValue = item.price ?? item.print ?? 0;

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
};



  // ➕ INCREASE QUANTITY
  const increaseQuantity = (name) => {
    setCartItems(prevCart =>
      prevCart.map(item =>
        item.name === name
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // ➖ DECREASE QUANTITY
  const decreaseQuantity = (name) => {
    setCartItems(prevCart =>
      prevCart
        .map(item =>
          item.name === name
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  // 🗑 REMOVE ITEM
  const removeItem = (name) => {
    setCartItems(prevCart =>
      prevCart.filter(item => item.name !== name)
    );
  };

  // 🧾 CLEAR CART
  const clearCart = () => {
    setCartItems([]);
  };

  // ✅ Load categories and items when token exists
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

  const setAuthData = (token, role) => {
    setAuth({ token, role });
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
  };

  

  const contextValue = {
    categories,
    setCategories,
    items,
    setItems,
    auth,
    setAuthData,
    cartItems,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};
