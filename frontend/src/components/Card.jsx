import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "./card.css"
import { toast } from 'react-toastify'
import axios from 'axios'
import { useCart } from './CartContext'
const Card = ({title, cardImg, price, rating, reviewNo, cardDesc, itemLink, category}) => {
    const navigate = useNavigate()
    const Server_Url = import.meta.env.VITE_SERVER_URL
    const { refreshCartCount } = useCart();
    const addToCart = async (productId)=>{
      const token = localStorage.getItem("token")
      if(!token){
        toast.error("Please log in to add items to your cart", {
            position: "top-center",
            autoClose: 500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "light",
            className: "my-toast",
        });
        return;
      }
      const quantity = 1
      try{
        await axios.post(`${Server_Url}/cart`, {productId, quantity}, {headers:{Authorization: `Bearer ${token}`}})
        toast.success("Item added to cart!", {
            position: "top-center",
            autoClose: 500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "light",
            className: "my-toast",
        })
        refreshCartCount()
      }catch(err){
        toast.error("Unable to add item to cart", {
            position: "top-center",
            autoClose: 500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "light",
            className: "my-toast",
        })
      }
    }
    
    let description;
    if(cardDesc){
        description = cardDesc
    }else{
        description= category
    }
  return (
    <>
        <div className='cardcard'>
            <Link to={`/product/${itemLink}`} className='cardcardLink'>
            <img className='cardcardImg' loading='lazy' src={cardImg} alt={title} />
            <div className='cardcardRating'><span className='cardcardStar'>⭐</span> <span className='cardcardRateNum'> {rating} </span><span className='cardcardReview'>• {reviewNo} {reviewNo > 1 ? "reviews" : "review"}</span></div>
            <h2 className='cardcardHead'>{title}</h2>
            <h3 className='cardcardDesc'>{category}</h3>
            <p className='cardcardPrice'>{price}</p>
            </Link>
            <button className='cardcardBtn' onClick={()=>addToCart(itemLink)}>Add to Cart</button>
        </div>
    </>
    
  )
}

export default React.memo(Card);