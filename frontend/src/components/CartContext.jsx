import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const Server_Url = import.meta.env.VITE_SERVER_URL
  const refreshCartCount = async () => {
    const token = localStorage.getItem("token");
    if (!token) { setCartCount(0); return; }
    const res = await axios.get(`${Server_Url}/cart/count`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setCartCount(res.data.count);
  };

  useEffect(() => { refreshCartCount(); }, []);

  return (
    <CartContext.Provider value={{ cartCount, refreshCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);