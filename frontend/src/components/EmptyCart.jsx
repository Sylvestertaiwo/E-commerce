import React from 'react'
import "./EmptyCart.css";
import { useNavigate } from 'react-router-dom';

export default function EmptyCart({ onBrowse }) {
  const navigate = useNavigate()
  return (
    <div className="empty-cart">
      <div className="empty-cart-panel">
        <div className="empty-cart-orbit">
          <svg
            viewBox="0 0 240 240"
            className="empty-cart-svg"
            role="img"
            aria-label="Illustration of an empty shopping cart resting inside a dashed ring"
          >
            

            <circle cx="52" cy="66" r="2" className="dot" />
            <circle cx="196" cy="58" r="1.6" className="dot" />
            <circle cx="205" cy="176" r="1.6" className="dot" />
            <circle cx="34" cy="182" r="2" className="dot" />
            <circle cx="120" cy="34" r="1.4" className="dot" />

            <svg className="cart-icon" xmlns="http://www.w3.org/2000/svg" width="150" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 5H5.2C5.8 5 6.3 5.4 6.5 6L8.2 13.5C8.4 14.3 9.1 15 10 15H17.5C18.4 15 19.1 14.4 19.3 13.6L20.5 8.5C20.7 7.6 20 7 19.1 7H7.3"
                stroke="#94A3B8"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="8.5" cy="18.5" r="1.8" stroke="#94A3B8" strokeWidth="1" />
              <circle cx="17.5" cy="18.5" r="1.8" stroke="#94A3B8" strokeWidth="1" />
            </svg>

            
            <circle r="4" className="marker">
              <animateMotion
                dur="10s"
                repeatCount="indefinite"
                path="M20 120 A100 38 0 1 1 220 120 A100 38 0 1 1 20 120"
              />
            </circle>
          </svg>
        </div>

        <span className="empty-cart-status">Cart status · empty</span>
        <h2 className="empty-cart-title">Your cart is empty</h2>
        <p className="empty-cart-subtitle">
          Nothing here yet. Browse the catalog and add something you like.
        </p>

        <button className="empty-cart-btn" onClick={()=>navigate("/shop")} type="button">
          Browse products
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
