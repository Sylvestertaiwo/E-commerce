import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination"
import "./categoryswiper.css"
import { FreeMode, Mousewheel, Navigation, Pagination, Zoom } from "swiper/modules";
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';

const ProductSwiper = ({title, products})=> {
    const newProduct = products.slice(0, 10)
    return (
        <>
            <h2 className='product-swiper-text'>{title}</h2>
            <div >
            <Swiper className='swiper'
                modules={[Mousewheel, FreeMode, Navigation]}
                navigation
                freeMode={true}
                grabCursor={true}
                breakpoints={{
                    320: {slidesPerView: 1.5, spaceBetween:10},
                    400: {slidesPerView: 2.3, spaceBetween:10},
                    576: {slidesPerView: 2.5, spaceBetween:10},
                    768: {slidesPerView: 3.5, spaceBetween:10},
                    1024: { slidesPerView: 5.5, spaceBetween:15,}
                                }}
            >
                
                    {newProduct.map(product => (
                    <SwiperSlide key={product._id} >
                        <ProductCard title={product.name} cardImg={product.images} price={`₦${product.retailPrice.toLocaleString()}`} cardDesc={product.description} itemLink={product._id} category={product.category}  />
                    </SwiperSlide>
                ))}{products.length > 10 && (
                    <SwiperSlide key="view-more">
                        <div className='product-view'>
                        <div className='view-more-card'>
                            <Link to="/shop" style={{textDecoration:"none"}}>
                                <div className="view-more-content">
                                    <span className="view-more-arrow">→</span>
                                    <p>View all products</p>
                                </div>
                            </Link>
                        </div>
                        </div>
                    </SwiperSlide>)}
            </Swiper>
                </div>
        </>
    );
}

export default ProductSwiper