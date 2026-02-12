import { createContext, useEffect, useState } from "react";
import { fetchCategories } from "../Service/CategoryService";
import { fetchItems } from "../Service/ItemService";

export const AppContext = createContext(null);

export const AppContextProvider = (props) => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token"), // 👈 restore on refresh
    role: localStorage.getItem("role"),
  });
  const [cartItems, setCartItems] = useState([]);

const addToCart = (item) => {
  const existingItem = cartItems.find(carfItem => cartItems,name === item.name);
  if(existingItem){
    setCartItems(cartItems.map(cartItem => cartItem.name== item.name ? {...cartItem, quantity: cartItem.quantity+1}: cartItem));
  } else {
    setCartItems([...cartItems, {...item, quantity:1}]);
  }
}


  // ✅ Load categories and items ONLY when token is available
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
  }, [auth.token]); // 👈 IMPORTANT dependency

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
    addToCart,
    cartItems,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};
