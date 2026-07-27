import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SkeletonCard, SkeletonGrid } from './SkeletonCard';
import Navbar from './Navbar';
import Card from './Card';
import './ProductListing.css'

const SearchResult = () => {
    const [selectorDiv, setSelectorDiv] = useState("")
    const [selectorState, setSelectorState] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get("search") || "";
    const page = Number(searchParams.get("page")) || 1;
    const sort = searchParams.get("sort") || "";

    const [results, setResults] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const Server_Url = import.meta.env.VITE_SERVER_URL
    useEffect(() => {
      async function getResult() {
        setLoading(true)
        setError(null)
        const params = new URLSearchParams()
          if (search) params.set("search", search)
          if (sort) params.set("sort", sort)
          params.set("page", page)
        try{
          const fetchedResult = await axios.get(`${Server_Url}/products?${params.toString()}`)
            setResults(fetchedResult.data.product || [])
            setPagination(fetchedResult.data.pagination)
        }catch(err){
            setError(err.message)
        }finally{
          setLoading(false)
        }
      }
      getResult()
    }, [search, page, sort])

    useEffect(() => {
        const newSort = selectorDiv;
        setSearchParams({ search, sort: newSort, page: 1 });
    }, [selectorDiv])

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
        {loading ? (
      <SkeletonGrid count={16}/> ) : (
  <>
    <div>
      <div className='topBar'>
        <div className='categoryName'>
          {search ? `Results for "${search}"` : "Search"}
        </div>

        <div className='selectionDiv'>
          <button onClick={()=>setSelectorState((s)=>!s)} className='selectortoggle'>{showingSelector}</button>

          {selectorState && <div className='selectionInput'>
            <div onClick={()=>setSelectorDiv("")} className='selector'>Newest</div>
            <div onClick={()=>setSelectorDiv("price_asc")} className='selector'>Price: Low to High</div>
            <div onClick={()=>setSelectorDiv("price_desc")}>Price: High to Low</div>
          </div>}
        </div>
      </div>

      {error ? (
        <p className='searchMessage'>{error}</p>
      ) : results.length === 0 ? (
        <div className='searchEmpty'>
          <p className='searchMessage'>No products found for "{search}".</p>
          <p className='searchSubMessage'>Try checking your spelling or searching a different term.</p>
        </div>
      ) : (
        <>
          <div className='productOverall'>
            {results.map((r) => (
              <div key={r._id}>
                <Card
                  cardImg={r.images[0]}
                  title={r.name}
                  cardDesc={r.description}
                  price={r.retailPrice != null
                    ? `₦${r.retailPrice.toLocaleString()}`
                    : "Price not available"}
                  itemLink={r._id}
                  rating={r.rating}
                  reviewNo={r.ratingsCount}
                  category={r.category}
                />
              </div>
            ))}
          </div>

          <center>
            <div className='navigation'>
              <button disabled={page === 1} onClick={() => setSearchParams({ search, sort, page: page - 1 })} className='navigationBtn'>-</button>
              <div className='navigationDiv'>Page {pagination.currentPage} of {pagination.totalPages}</div>
              <button disabled={paginationPlus} onClick={() => setSearchParams({ search, sort, page: page + 1 })} className='navigationBtn'>+</button>
            </div>
          </center>
        </>
      )}
    </div>
  </>
)}
    </>
  )
}

export default SearchResult