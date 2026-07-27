import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { SkeletonGrid } from './SkeletonCard'
import { toast } from 'react-toastify'
import Navbar from './Navbar'
import './productDetail.css'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import NotFound from './NotFound'
import { useCart } from './CartContext'

const ProductDetail = () => {
    const {refreshCartCount} = useCart()
    const {id} = useParams()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [related, setRelated] = useState([])
    const [product, setProduct] = useState(null)
    const [activeImg, setActiveImg] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [showFullDesc, setShowFullDesc] = useState(false)
    const navigate = useNavigate()
    const Server_Url = import.meta.env.VITE_SERVER_URL
useEffect(() => {
      const fetchProduct = async ()=>{
        setLoading(true)
        setError(false)
    try{
        const [productRes, relatedRes] = await Promise.all([
            axios.get(`${Server_Url}/products/${id}`),
            axios.get(`${Server_Url}/products/${id}/related`),
        ]);
        if(!productRes.data.product){
            return navigate("*")
        }
        setRelated(relatedRes.data.relatedResult);
        setProduct(productRes.data.product);
        setActiveImg(0)
        setQuantity(1)
    }catch(err){
        setError(err.message)
    }finally{
        setLoading(false)
    }
      }
      fetchProduct()
}, [id])

    const increaseQty = () => setQuantity((q) => q + 1)
    const decreaseQty = () => setQuantity((q) => Math.max(1, q - 1))

    const addToCart = async () => {
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
      try{
        await axios.post(`${Server_Url}/cart`, {productId: product._id, quantity}, {headers:{Authorization: `Bearer ${token}`}})
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

    if (!loading && !product) {
      return (
        <>
          <Navbar/>
          <div className="pd-state">
            <p>Something went wrong{error ? `: ${error}` : ""}</p>
          </div>
        </>
      );
    }

  return (
    <>
    <Navbar/>
    {loading ? <SkeletonGrid/> :
        <div className="pd-page"> <>

            <div className="pd-container">
                <nav className="pd-link">
                    <Link to="/">Home</Link>
                    {product.category && (
                        <>
                            <span>/</span>
                            <Link to={`/category/${product.category}`}>{product.category}</Link>
                        </>
                    )}
                </nav>

                <div className="pd-main">
                    <div className="pd-img">
                        <div className="pd-img-main">
                            <img src={product.images[activeImg]} alt={product.name} />
                        </div>
                        {product.images.length > 1 && (
                            <div className="pd-img-thumbs">
                                {product.images.map((img, i) => (
                                    <button
                                        key={i}
                                        className={`pd-img-thumb ${activeImg === i ? "pd-img-thumb--active" : ""}`}
                                        onClick={() => setActiveImg(i)}
                                        type="button"
                                        aria-label={`Show image ${i + 1}`}
                                    >
                                        <img src={img} alt="" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="pd-info">
                        {product.rating != null && (
                            <div className="pd-rating">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                                    <path d="M7 1l1.8 3.7 4.1.6-3 2.9.7 4.1L7 10.4 3.4 12.3l.7-4.1-3-2.9 4.1-.6L7 1z"/>
                                </svg>
                                <span>{product.rating}</span>
                                <span className="pd-rating-count">
                                    · {product.ratingsCount} review{product.ratingsCount !== 1 ? "s" : ""}
                                </span>
                            </div>
                        )}

                        <h1 className="pd-title">{product.name}</h1>

                        <p className="pd-price">
                            {product.retailPrice != null
                            ? `₦${product.retailPrice.toLocaleString()}`
                            : "Price not available"}
                        </p>

                        <div className="pd-qty">
                            <button onClick={decreaseQty} disabled={quantity < 2} aria-label="Decrease quantity" type="button">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                            </button>
                            <div>{quantity}</div>
                            <button onClick={increaseQty} aria-label="Increase quantity" type="button">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                            </button>
                        </div>

                        <button className="pd-btn" onClick={addToCart} type="button">
                            Add to Cart
                        </button>

                        {product.description && (
                            <div className="pd-desc">
                                <h3>Description</h3>
                                <p className={showFullDesc ? "" : "pd-desc-clamped"}>{product.description}</p>
                                <button
                                    className="pd-desc-toggle"
                                    onClick={() => setShowFullDesc((s) => !s)}
                                    type="button"
                                >
                                    {showFullDesc ? "Show less" : "Read more"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {related.length > 0 && (
                <div className="pd-related">
                    <h2 className="pd-related-title">You may also like</h2>
                    <Swiper
                        modules={[Navigation]}
                        navigation
                        spaceBetween={16}
                        slidesPerView={2}
                        grabCursor={true}
                        breakpoints={{
                            480: { slidesPerView: 2.4 },
                            768: { slidesPerView: 3.4 },
                            1024: { slidesPerView: 4.4 },
                        }}
                        className="pd-swiper"
                    >
                        {related.map((r) => (
                            <SwiperSlide key={r._id}>
                                <Link to={`/product/${r._id}`} className="pd-related-card">
                                    <div className="pd-related-img">
                                        <img src={r.images[0]} alt={r.name} />
                                    </div>
                                    <h3>{r.name}</h3>
                                    <p>
                                        {r.retailPrice != null ? `₦${r.retailPrice.toLocaleString()}` : "Price not available"}
                                    </p>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}
       </>
       </div>}
    </>
  )
}

export default ProductDetail
