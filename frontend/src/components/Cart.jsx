import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import './cart.css'
import Navbar from './Navbar';
import EmptyCart from './EmptyCart';
import CartSummary from './CartSummary';
import { useCart } from './CartContext';
const Cart = () => {
    
    const [cartItem, setCartItem] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [errMessage, setErrMessage] = useState("")
    const [showLoginPrompt, setShowLoginPrompt] = useState(false)
    const { refreshCartCount } = useCart();
    const Server_Url = import.meta.env.VITE_SERVER_URL;

    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setShowLoginPrompt(true);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(false);

      try {
        const res = await axios.get(`${Server_Url}/cart`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.data.status) {
          setError(true);
          setErrMessage(res.data.message)
          return;
        }
        return setCartItem(res.data.cartItem);
      } catch (err) {
        // console.log(err.message);
        setError(true);
        setErrMessage("unable to fetch your cart. please try again!")
      } finally {
        setLoading(false);
      }
    };
useEffect(() => {
  fetchCart()
  refreshCartCount()
}, []);

    async function increaseCartNum(cartId, currentQuantity){
      const token = localStorage.getItem("token") ;
      try{
        await axios.patch(`${Server_Url}/cart/${cartId}`,{ quantity: currentQuantity + 1 },{headers:{Authorization: `Bearer ${token}`}} )
        fetchCart()
      }catch(err){
        setError("unable to update cart")
      }
    }
    async function decreaseCartNum(cartId, currentQuantity){
      const token = localStorage.getItem("token") ;
      try{
        await axios.patch(`${Server_Url}/cart/${cartId}`,{ quantity: currentQuantity - 1 },{headers:{Authorization: `Bearer ${token}`}} )
        fetchCart()
      }catch(err){
        setError("unable to update cart")
      }
    }
    async function deleteCartItem(cartId, currentQuantity){
      const token = localStorage.getItem("token") ;
      try{
        await axios.delete(`${Server_Url}/cart/${cartId}`, {headers:{Authorization: `Bearer ${token}`}} )
        fetchCart()
        refreshCartCount()
      }catch(err){
        setError("unable to delete cart item")
      }
    }

    let showBox;
    if (showLoginPrompt) {
      showBox = (
        <div className="cart-error">
          <div className="cart-error-card">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="cart-error-icon" aria-hidden="true">
              <rect x="8" y="17" width="24" height="16" rx="3" stroke="currentColor" strokeWidth="2"/>
              <path d="M13 17v-4a7 7 0 0 1 14 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h2 className="cart-error-title">Sign in to see your cart</h2>
            <p className="cart-error-subtitle">Your saved items are waiting for you. Sign in to pick up where you left off.</p>
            <Link to="/signin" className="cart-error-btn">
              Sign in
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      );
    } else if (loading) {
      showBox = (
        <div className="cart-list">
          {[1, 2, 3].map((n) => (
            <div key={n} className="cart-skeleton">
              <div className="skeleton-block skeleton-img" />
              <div className="skeleton-lines">
                <div className="skeleton-block skeleton-line" style={{ width: "60%" }} />
                <div className="skeleton-block skeleton-line" style={{ width: "35%" }} />
              </div>
              <div className="skeleton-block skeleton-pill" />
            </div>
          ))}
        </div>
      );
    } else if (error) {
      showBox = (
        <div className="cart-error">
          <div className="cart-error-card cart-error-card--error">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="cart-error-icon" aria-hidden="true">
              <circle cx="20" cy="20" r="15" stroke="currentColor" strokeWidth="2"/>
              <path d="M20 13v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="20" cy="27" r="1.2" fill="currentColor"/>
            </svg>
            <h2 className="cart-error-title">Something went wrong</h2>
            <p className="cart-error-subtitle">{errMessage}</p>
            <button onClick={fetchCart} className="cart-error-btn cart-error-btn--ghost" type="button">
              Try again
            </button>
          </div>
        </div>
      );
    } else{
      if(cartItem.length === 0){
        showBox = <EmptyCart/>
      }else{showBox = (
        <div className='cart-overall'>
          <div className="cart-list">
            {cartItem.map((c)=>(
            <div key={c._id} className='cartCard'>
              <Link to={`/product/${c.product._id}`} className='cardLink'>
                <img src={c.product.images[0]} alt={c.product.name} className='cartImg'/>
                <div className="cartCard-info">
                  <h2 className='cartCardHead'>{c.product.name}</h2>
                  <p className='cartCardPrice'>₦{c.product.retailPrice.toLocaleString()}</p>
                </div>
              </Link>
              <div className='cartNumDiv'>
                <button onClick={()=>decreaseCartNum(c._id, c.quantity)} disabled={c.quantity < 2}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                </button>
                <div>{c.quantity}</div>
                <button onClick={()=>increaseCartNum(c._id, c.quantity)}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                </button>
              </div>
              <button onClick={()=>deleteCartItem(c._id)} className='removeCartBtn' type="button">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                  <path d="M2.5 4h10M5.5 4V2.5h4V4M6 6.5v4M9 6.5v4M3.5 4l.6 8a1 1 0 0 0 1 .9h4.8a1 1 0 0 0 1-.9l.6-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Remove</span>
              </button>
            </div>
            ))}
            </div>
          <div className='summarydiv'><CartSummary items={cartItem}/></div>
        </div>
      )
    }}

  return (
    <div className="cart-page">
      <Navbar/>
      <div className="cart-container">
        {!showLoginPrompt && !loading && (
          <div className="cart-header">
            {!error && cartItem.length > 0 && (
              <span className="cart-header-count">{cartItem.length} product{cartItem.length > 1 ? "s" : ""}</span>
            )}
          </div>
        )}
        {showBox}
      </div>
    </div>
  )
}

export default Cart
