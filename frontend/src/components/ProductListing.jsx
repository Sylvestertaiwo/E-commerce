import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { SkeletonCard, SkeletonGrid } from './SkeletonCard';
import { toast } from 'react-toastify';
import Navbar from './Navbar';
import Card from './Card';
import './ProductListing.css'
import { useRef } from 'react';

const ProductListing = () => {
    const [selectorDiv, setSelectorDiv] = useState("")
    const [selectorState, setSelectorState] = useState(false)
    const {category} = useParams();
    const [pagination, setPagination] = useState(null)
    const [loading, setLoading] = useState(true) 
    const [error, setError] = useState(null)
    const [product, setProduct] = useState([])
    const [searchParams, setSearchParams] = useSearchParams()
    const page = Number(searchParams.get("page")) || 1
    const sort = searchParams.get("sort") || ""
    const selectorRef = useRef(null);
    const Server_Url = import.meta.env.VITE_SERVER_URL
    useEffect(() => {   
      const fetchProduct = async ()=>{
        setLoading(true)
        setError(false)

        const params = new URLSearchParams();
        if (category) params.set("category", category)
        if(sort) params.set("sort", sort)
        params.set("page", page)
        params.set("limit", 20)

        try{
            const res = await axios.get(`${Server_Url}/products?${params.toString()}`)
            setProduct(res.data.product)
            setPagination(res.data.pagination)

        }catch(err){
            setError("Unable to get products, please try again.")
        }finally{
            setLoading(false)
        }  
      }
      fetchProduct()
    }, [category, page, sort])
    useEffect(() => {
      function handleClickOutsideSelector(e){
        if(selectorRef.current && !selectorRef.current.contains(e.target)){
          setSelectorState(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutsideSelector)
      return () => document.removeEventListener("mousedown", handleClickOutsideSelector)
    }, [])
    
    
    useEffect(() => {
        const newSort = selectorDiv;
        setSearchParams({ sort: newSort, page: 1 });
    }, [selectorDiv])
    
    const addToCart = async (productId)=>{
      const token = localStorage.getItem("token")
      if(!token){
        toast.error("log in to add items to your cart", {
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
        toast.success("product Item added to cart!", {
            position: "top-center",
            autoClose: 500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "light",
            className: "my-toast",
        })
        
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


    let showingSelector;
    if(selectorDiv == ""){
      showingSelector = "Newest"
    }else if(selectorDiv == "price_asc"){
      showingSelector = "Price: Low to High"
    }else if(selectorDiv == "price_desc"){
      showingSelector = "Price: High to Low"
    } 

    const [paginationPlus, setPaginationPlus] = useState(false)
        useEffect(() => {
          if(pagination && pagination.currentPage === pagination.totalPages){
            setPaginationPlus(true)
          } else {
            setPaginationPlus(false)
          }
        }, [pagination])
  return (
    <>
    <Navbar/>
        {loading ? <SkeletonGrid count={16}/>  : ( 
  <>
    {error ? (<div style={{display: "flex", width: "100vw", height: "100dvh", justifyContent: "center", alignItems:"center"}}><p>{error}</p></div>) : ( 
      <>
    <div>
      <div className='topBar'>
        <div className='categoryName'>{category ? category.charAt(0).toUpperCase() + category.slice(1) : "Shop"}</div>
          
          <div ref={selectorRef} className='selectionDiv'>
          <button onClick={()=>setSelectorState((s)=>!s)} className='selectortoggle'>{showingSelector}</button>
            
              {selectorState && <div className='selectionInput'>
                <div  onClick={()=>setSelectorDiv("")} className='selector'>Newest</div>
                <div onClick={()=>setSelectorDiv("price_asc")} className='selector'>Price: Low to High</div>
                <div  onClick={()=>setSelectorDiv("price_desc")}>Price: High to Low</div>
                
            </div>}
        
        </div>
      </div>
        <div className='productOverall'>
      {product.map((product) => (
        <div key={product._id}>
        <Card cardImg={product.images[0]} title={product.name} cardDesc={product.description} price={product.retailPrice != null
              ? `₦${product.retailPrice.toLocaleString()}`
              : "Price not available"} itemLink={product._id} rating={product.rating} reviewNo={product.ratingsCount} category={product.category}/>
        </div>
      ))}
    </div>
    </div>
      {pagination && (
    <center>
      <div className='navigation'>
        <button disabled={page === 1} onClick={() => setSearchParams({sort, page: page - 1 })} className='navigationBtn'>-</button>
        <div className='navigationDiv'>Page {pagination.currentPage} of {pagination.totalPages}</div>
        <button disabled={paginationPlus} onClick={() => setSearchParams({sort, page: page + 1 })} className='navigationBtn'>+</button>
      </div>
    </center>)}
    </>)}
  </>
)}
    </>
  )
}

export default ProductListing