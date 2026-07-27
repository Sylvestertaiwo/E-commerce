import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Navbar from './Navbar'
import './Account.css'

const Account = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const Server_Url = import.meta.env.VITE_SERVER_URL
  useEffect(() => {
    if (!token) {
      navigate("/signin")
      return
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${Server_Url}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setUser(res.data.user)
      } catch (err) {
        toast.error("Unable to load your account", {
            position: "top-center",
            autoClose: 500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "light",
            className: "my-toast",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="account-page">
          <p className="account-message">Loading your account...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="account-page">
        <div className="account-card">
          <h1 className="account-title">My Account</h1>

          <div className="account-summary">
            <p className="account-name">{user?.firstname} {user?.lastname}</p>
            <p className="account-email">{user?.email}</p>
          </div>

          <div className="account-divider" />

          <nav className="account-menu">
            <Link to="/account/edit" className="account-menu-item">
              <span>Edit Profile</span>
              <span className="account-menu-arrow">→</span>
            </Link>
            <Link to="/account/password" className="account-menu-item">
              <span>Change Password</span>
              <span className="account-menu-arrow">→</span>
            </Link>
            <Link to="/orders" className="account-menu-item">
              <span>My Orders</span>
              <span className="account-menu-arrow">→</span>
            </Link>
          </nav>

          <button onClick={handleLogout} className="account-logout">Log Out</button>
        </div>
      </div>
    </>
  )
}

export default Account