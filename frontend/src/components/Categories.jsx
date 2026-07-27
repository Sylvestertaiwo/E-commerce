import axios, { Axios } from 'axios'
import React, { useEffect, useState } from 'react'
import CategoryCard from './CategoryCard'
import "./category.css"
import { SkeletonGrid } from "./SkeletonCard";

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
import CategorySwiper from './CategorySwiper';

const Categories = () => {
  const Server_Url = import.meta.env.VITE_SERVER_URL
  const newurl = `${Server_Url}/categories`
  const [categories, setcategories] = useState([])
  const [Loading, setLoading] = useState(true)

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
  useEffect(() => {
    const retrieveInfo = async ()=>{
      try{
        const response = await axios.get(newurl)
        if(response.status){
          const newCat = response.data
          setcategories(newCat.message)
          setLoading(false)
        }
        else{
          console.log("unable to fetch", response.data.message)
        }
      }
      catch{
        console.log("nahhhhh!!!!!")
      }
    } 
    retrieveInfo()
  }, [])
  return (
    <>
        <Navbar/>
        {Loading?<SkeletonGrid count={8}/>: 
        <div className='cat-contain'>
          
            <div className='all-categories  '>All categories</div>
            <div className='browse-categories'>Browse Products by category</div>
            {/* <div>Every category, one clean orbit around your next purcase</div> */}
          
            
              <div className='category-overall'>{categories.map((product, index)=>{
                const image = imageObj[product.category]
                return(
                <Link to={`/category/${product.category}`} key={index} className='cardcardLink'>
                    <CategoryCard img={image?.imgLink} imgAlt={image?.imgAlt} mainText={product.category} count={product.count}/>
                </Link>
                  )
                  })}
                </div>
        
        </div>
            }
    </>
  )
}

export default Categories