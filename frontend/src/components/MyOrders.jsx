import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar';
import './MyOrders.css'

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const Server_Url = import.meta.env.VITE_SERVER_URL
  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setShowLoginPrompt(true);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${Server_Url}/cart/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.data.status) {
          setError(res.data.message);
          return;
        }
        setOrders(res.data.orders);
      } catch (err) {
        setError("Unable to load your orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  let showBox;
  if (showLoginPrompt) {
    showBox = (
      <p className="orders-message">
        You need to be logged in to view your orders. <Link to="/signin">Sign In</Link>
      </p>
    );
  } else if (loading) {
    showBox = <p className="orders-message">Loading your orders...</p>;
  } else if (error) {
    showBox = <p className="orders-message">{error}</p>;
  } else if (orders.length === 0) {
    showBox = <p className="orders-message">You haven't placed any orders yet.</p>;
  } else {
    showBox = orders.map((order) => (
      <div className="order-card" key={order._id}>
        <div className="order-card-header">
          <div>
            <span className="order-id">Order #{order._id.slice(-8)}</span>
            <span className="order-date">
              {new Date(order.createdAt).toLocaleDateString()}
            </span>
          </div>
          <span className={`order-status status-${order.paymentStatus}`}>
            {order.paymentStatus}
          </span>
        </div>

        <div className="order-items">
          {order.items.map((item, i) => (
            <div className="order-item" key={i}>
              <img src={item.product.images?.[0]} alt={item.product.name}/>
              <div className="order-item-info">
                <p className="order-item-name">{item.product.name}</p>
                <p className="order-item-meta">
                  Qty: {item.quantity} · ₦{item.price.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="order-card-footer">
          <span>Shipping to: {order.shippingAddress}</span>
          <span className="order-total">₦{order.totalAmount.toLocaleString()}</span>
        </div>
      </div>
    ));
  }

  return (
    <>
    <Navbar/>
    <div className="my-orders-page">
      <h1 className="orders-title">My Orders</h1>
      {showBox}
    </div>
    </>
  )
}

export default MyOrders