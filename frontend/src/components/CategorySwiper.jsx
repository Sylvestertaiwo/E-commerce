import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination"
import "./categoryswiper.css"
import { Navigation, Pagination } from "swiper/modules";

import bag from "../assets/categories/bag.webp"
import beauty from "../assets/categories/beauty.webp"
import electronics from "../assets/categories/electronic.webp"
import furniture from "../assets/categories/furniture.webp"
import games from "../assets/categories/games.webp"
import home from "../assets/categories/home.webp"
import jewellery from "../assets/categories/jewellery.webp"
import musical from "../assets/categories/musicals.webp"
import shoe from "../assets/categories/shoe.webp"
import sunglass from "../assets/categories/sunglass.webp"
import Arts from "../assets/categories/Arts.webp"
import automotive from "../assets/categories/automotive.webp"
import Baby from "../assets/categories/Baby.webp"
import books from "../assets/categories/books.webp"
import camping from "../assets/categories/camping.webp"
import groceries from "../assets/categories/groceries.webp"
import healthandhouse from "../assets/categories/healthandhouse.webp"
import healthandwellness from "../assets/categories/healthandwellness.webp"
import homedecor from "../assets/categories/homedecor.webp"
import industrial from "../assets/categories/industrial.webp"
import kitchen from "../assets/categories/kitchenware.webp"
import music from "../assets/categories/music.webp"
import office from "../assets/categories/office.webp"
import pet from "../assets/categories/petsupplies.webp"
import sport from "../assets/categories/sport.webp"
import tools from "../assets/categories/tools.webp"
import toys from "../assets/categories/toys.webp"
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import CategorySwiperCard from './CategorySwiperCard';

const CategorySwiper = ({ title, categories }) => {
    const imageObj = {
        Music : {imgLink : music, imgAlt : "music"},
        Toys : {imgLink : toys, imgAlt : "toys"},
        "Tools & Home Improvement" : {imgLink : tools, imgAlt : "tools & home improvement"},
        "Sports & Outdoors" : {imgLink : sport, imgAlt : "sport & outdoor"},
        "Pet Supplies" : {imgLink : pet, imgAlt : "pet supplies"},
        "Office Supplies" : {imgLink : office, imgAlt : "office supplies"},
        Kitchenware : {imgLink : kitchen, imgAlt : "kitchenware"},
        "Industrial & Scientific" : {imgLink : industrial, imgAlt : "industrial & scientific"},
        "Home Decor" : {imgLink : homedecor, imgAlt : "home"},
        "Healthcare & Wellness" : {imgLink : healthandhouse, imgAlt : "healthcare & wellness"},
        "Health & Household" : {imgLink : healthandwellness, imgAlt : "health & household"},
        Groceries : {imgLink : groceries, imgAlt : "groceries"},
        "Camping & Hiking" : {imgLink : camping, imgAlt : "caming & hiking"},
        Books : {imgLink : books, imgAlt : "books"},
        "Baby Products" : {imgLink : Baby, imgAlt : "baby products"},
        Automotive : {imgLink : automotive, imgAlt : "automoive"},
        "Arts & Crafts" : {imgLink : Arts, imgAlt : "arts"},
        "Travel Accessories" : {imgLink : bag, imgAlt : "bag"},
        "Beauty & Personal Care" : {imgLink : beauty, imgAlt : "beauty"},
        Electronics : {imgLink : electronics, imgAlt : "electronics"},
        Furniture : {imgLink : furniture, imgAlt : "furniture"},
        "Gaming & Accessories" : {imgLink : games, imgAlt : "games"},
        "Home Appliances": {imgLink : home, imgAlt : "home"},
        Jewelry : {imgLink : jewellery, imgAlt : "jewellery"},
        "Music Instruments": {imgLink : musical, imgAlt : "musical"},
        Footwear : {imgLink : shoe, imgAlt : "shoes"},
        "Gardening & Outdoor" : {imgLink : sunglass, imgAlt : "sunglasses"}, 
      }
      const displaycategories = categories.slice(0, 7);
    return (
        <>
            <h2 className='swiper-text'>{title}</h2>

            <Swiper className='swiper'
                modules={[Navigation]}
                navigation
                grabCursor={true}
                breakpoints={{
                   320: {slidesPerView: 1.5, spaceBetween:10},
                   400: {slidesPerView: 2.3, spaceBetween:10},
                    576: {slidesPerView: 2.5, spaceBetween:10},
                    768: {slidesPerView: 3.5, spaceBetween:10},
                    1024: { slidesPerView: 5.5, spaceBetween:15,}
                }}
            >
                {displaycategories.map((category, index,) => (
                    <SwiperSlide key={index}>
                        <Link style={{textDecoration: "none"}} to={`/category/${category.category}`}>
                            <CategorySwiperCard img={imageObj[category.category]?.imgLink} mainText={category.category} count={category.count} imgAlt={imageObj[category.category]?.imgAlt}/>
                        </Link>
                    </SwiperSlide>
                ))}
                {categories.length > 8 && (
                    <SwiperSlide key="view-more">
                        <div className='view-more-card'>
                            <Link to="/categories" style={{textDecoration: "none"}}>
                            <div className="view-more-content">
                                <span className="view-more-arrow">→</span>
                                <p>View all categories</p>
                            </div>
                        </Link>
                        </div>
                        
                    </SwiperSlide>
                )}
            </Swiper>
        </>
    );
};

export default CategorySwiper;