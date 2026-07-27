import React, { useEffect, useState } from 'react'
import './Hero.css'
import headphone  from '../assets/headphone.webp'
import Navbar from './Navbar'
import ProductSwiper from './ProductSwiper'
import axios from 'axios'
import CategorySwiper from './CategorySwiper'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
    const [trendingCategories, setTrendingCategories] = useState([]);
    const [trendingProducts, setTrendingProducts] = useState([])
    const [newProducts, setNewProducts] = useState([])
    const [bestSellingProducts, setBestSellingProducts] = useState([])
    const navigate = useNavigate()
    const Server_Url = import.meta.env.VITE_SERVER_URL
    useEffect(() => {
        const getCategories = async ()=>{
            try{
                const res = await axios.get(`${Server_Url}/categories`);
                    if(res.data.status){
                       setTrendingCategories(res.data.message)
                }
            else{
                console.log("unable to fetch", res.data.message)
            }
            }catch(err){
                console.log("unable to fetch categories", err.message)
            }


            try{
                const res = await axios.get(`${Server_Url}/products`, {
                    params: { sort: "price_desc" }
                });
                       setTrendingProducts(res.data.product || [])
            }catch(err){
                console.log("unable to fetch product", err.message)
            }

            try{
                const res = await axios.get(`${Server_Url}/products`, {
                });
                       setNewProducts(res.data.product || [])
            }catch(err){
                console.log("unable to fetch product", err.message)
            }
            
            try{
                const res = await axios.get(`${Server_Url}/products`, {
                    params: { sort: "name_asc" }
                });
                       setBestSellingProducts(res.data.product || [])
            }catch(err){
                console.log("unable to fetch product", err.message)
            }
        }
        getCategories()
    }, [])
        
      
    
  return (
    <>
    <Navbar/>
    <div className='hero-container'>
        <div className='hero-top'>
            <div className='hero-main'>
                    <div className='upper-text'>NEW COLLECTION</div>
                    <h1 className='curated-goods'>Curated goods,<br /><span className='exceptional'>quietly exceptional</span></h1>
                    <div className='thousands'>Thousands of products, chosen with care</div>
                    <button onClick={()=>navigate("/shop")} type='button' className='hero-explore-btn'>Explore the store <i className='next'>🡪</i> </button>
                    <div className='hero-rating-div'><i className='hero-rating' aria-hidden="true">4.5 average</i></div>
                    <img src={headphone} alt="item" className='headphone-img'/>
            </div>
            <div className='hero-right'>
                <div className='right-disp'>
                    <div className='upper-text'>SHOP</div>
                    <div>
                        <div className='hero-side-text'>Electronics</div>
                    <div className='hero-mini-text'>400 pieces</div>
                    </div>
                    
                </div>
                <div className='right-disp'>
                    <div className='upper-text'>SHOP</div>
                    <div>
                        <div className='hero-side-text'>Jewellery</div>
                    <div className='hero-mini-text'>400 pieces</div>
                    </div>
                    
                </div>
            </div>
        </div>
        <div className='hero-buttom'>
            <div className='buttom-disp'>
                <div>
                    <svg className='buttom-hero-svg' width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 8L12 3L21 8V16L12 21L3 16V8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                      <path d="M3 8L12 13L21 8" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                      <path d="M12 13V21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                </div>
                <div>
                    <div className='buttom-hero-main'>35,000+</div>
                    <div className='hero-mini-text'>Products</div>
                </div>
                
            </div>
            <div className='buttom-disp'>
                <div>
                    <svg className='buttom-hero-svg' width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
                      <rect x="13" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
                      <rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
                      <rect x="13" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
                    </svg>
                </div>
                <div>
                    <div className='buttom-hero-main'>15+</div>
                    <div className='hero-mini-text'>Categories</div>
                </div>
                
            </div>
            <div className='buttom-disp-right'>
                <div>
                    <svg className='buttom-hero-svg' width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 6H14V16H3V6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                      <path d="M14 9H18L21 12V16H14V9Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                      <circle cx="7" cy="18" r="2" stroke="currentColor" strokeWidth="1.8"/>
                      <circle cx="17" cy="18" r="2" stroke="currentColor" strokeWidth="1.8"/>
                    </svg>
                </div>
                <div>
                    <div className='buttom-hero-main'>Fast delivery</div>
                    <div className='hero-mini-text'>Nationwide Shipping</div>
                </div>
                
            </div>
        </div>
    </div>
    <div>
    
    <CategorySwiper title="🪐 Explore Categories" categories={trendingCategories}/>
    <ProductSwiper title="🚀 Trending Now" products={trendingProducts}/>
    <ProductSwiper title="✨ Fresh Drops" products={newProducts}/>
    <ProductSwiper title="⭐ Customer Favorites" products={bestSellingProducts}/>
{/*


    Footer */}
    </div>
    </>
  )
}

export default Hero