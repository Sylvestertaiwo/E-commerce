import { useState, useRef, useEffect } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NoResultsFound.css'
import { useCart } from './CartContext';

function Navbar({}) {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false);
  const [openDrop, setopenDrop] = useState(false);
  const [openList, setopenList] = useState(false);
  const [listDrop, setlistDrop] = useState(false)
  const inputRef = useRef(null);
  const closeTimeout = useRef(null);
  const closeProfileRef = useRef(null)
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);
  const token = localStorage.getItem("token")
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const hamburgerRef = useRef(null);
  const [dropDown, setDropDown] = useState(true)
  const [unblurSuggestion, setUnblurSuggestion] = useState(false)
  const [hamburgerDrop, setHamburgerDrop] = useState(false)
  const [activeList, setActiveList] = useState(false)
  const {cartCount} = useCart()
  const Server_Url = import.meta.env.VITE_SERVER_URL
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if(!query.trim() || query.trim().length < 2){
      setSuggestions([])
      return
    }
    debounceRef.current = setTimeout(async ()=>{
      setLoading(true)
      try{
        const res = await axios.get(`${Server_Url}/products/suggestions?search=${query.trim()}`);
        setSuggestions(res.data.response || []);
      } catch (err) {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }

    },300)
    return ()=> clearTimeout(debounceRef.current)
  }, [query])

  useEffect(() => {
    function handleClickOutsideAccount(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutsideAccount);
    return () => document.removeEventListener("mousedown", handleClickOutsideAccount);
  }, []);

  useEffect(() => {
    function handleClickOutsideHamburger(e) {
      if (hamburgerRef.current && !hamburgerRef.current.contains(e.target)) {
        setopenList(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutsideHamburger);
    return () => document.removeEventListener("mousedown", handleClickOutsideHamburger);
  }, []);
  
  useEffect(() => {
    setopenList(false)
  }, [])
  

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setOpen(false);
    navigate("/");
  }

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) onSearch(value);
  };

 const toggleListDrop = ()=> setlistDrop(!listDrop)
  const toggleList = ()=> setopenList(!openList)
  const openSearch = () => setExpanded(true);
  const closeHamburgerList = () => setopenList(false);
  if(hamburgerDrop){
    setopenList(false)
  }
  const activateDrop = () => {
    clearTimeout(closeTimeout.current);
    setopenDrop(true);
  }

  const closeDrop = () => {
    closeTimeout.current = setTimeout(() => {
    setopenDrop(false);
    }, 200);
  }
  const openProfile = ()=>{
    clearTimeout(closeProfileRef.current);
    setOpen(true);
  }
  const closeProfile = () => {
    closeProfileRef.current = setTimeout(() => {
    setOpen(false);
    }, 200);
  }

  const handleDrop = ()=>{setopenDrop(!openDrop)}
  const closeSearch = () => {
    if(!unblurSuggestion){
      if (document.activeElement === inputRef.current) return;
      setExpanded(false);
    }
  };

  const handleWrapClick = () => {
    if (!expanded) {
      setExpanded(true);
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    if (expanded) inputRef.current?.focus();
  }, [expanded]);
  let dropdownContent;
  if(loading){
    dropdownContent = <div className='suggestionDiv'>
    <div className="sss-shimmer sss-wrapper">
      <div className="sss-dropdown">
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="sss-row" key={i}>
            <div className="sss-shimmer sss-thumb" />
            <div className="sss-row-lines">
              <div className="sss-shimmer sss-line sss-line-title" />
              <div className="sss-shimmer sss-line sss-line-subtitle" />
            </div>
          </div>
        ))}
      </div>
    </div></div>
  }else if(suggestions.length === 0 && !loading && query.length > 2){
    dropdownContent = 
    <div className='suggestionDiv'>
        <div className="nrf-icon-circle">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="8" x2="14" y2="14" />
            <line x1="14" y1="8" x2="8" y2="14" />
          </svg>
        </div>
        <p className="nrf-title">No results for "{query}"</p>
        <p className="nrf-subtitle">
          Try checking your spelling or searching for something else.
        </p>
      </div>
  }else{
    dropdownContent = 
    <div className='suggestionList'> {suggestions.map((i)=>(
                      <Link to={`/product/${i._id}`} key={i._id} className='cardLink'>
                        <div className='suggestionContainer'>
                          <img src={i.images[0]} alt={i.name} className='suggestionImg'/>
                          <h2 className='suggestionName'>{i.name}</h2>
                          </div>
                      </Link>
                    ))}
      </div>
  }
  function handleKeyDown(e){
    if (e.key === "Enter" && query.trim() && query.length > 1){
      navigate(`/search?search=${encodeURIComponent(query.trim())}`)
    }
  }
  return (
  <>
      <nav className="navbar">
       <Link to="/">
       <div className="navbar-logo">
          <svg className='navbarslyIcon' width="32" height="24" viewBox="0 0 729 779" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M60.5 360L403 0L267 268L417.5 251.5L72 654.5L228.5 333.5L60.5 360Z" fill="url(#paint0_linear_2_7)"/>
      <path d="M149.5 663.5L465.5 254L331.5 568L492.5 602L149.5 663.5Z" fill="url(#paint1_linear_2_7)"/>
      <path d="M559.5 602C548.964 483.288 539.313 403.361 492.5 268C492.5 268 572.325 311.631 597.682 350.508C607.452 340.271 685.586 272.397 729 268C637.471 366.061 581.356 538.732 559.5 602Z" fill="url(#paint2_linear_2_7)"/>
      <path d="M31.5 754.5L0 687.5C51.4269 706.958 113.283 702.495 264.5 675.5C360.88 657.454 544.08 634.508 690.5 638.5C468.31 668.129 344.469 695.225 124 749.5L196.5 779L31.5 754.5Z" fill="url(#paint3_linear_2_7)"/>
      <defs>
      <linearGradient id="paint0_linear_2_7" x1="102" y1="104" x2="661.5" y2="680" gradientUnits="userSpaceOnUse">
      <stop stopColor="#60A5FA"/>
      <stop offset="0.243919" stopColor="#3B82F6"/>
      <stop offset="0.794452" stopColor="#1D4ED8"/>
      <stop offset="1" stopColor="#172554"/>
      </linearGradient>
      <linearGradient id="paint1_linear_2_7" x1="102" y1="104" x2="661.5" y2="680" gradientUnits="userSpaceOnUse">
      <stop stopColor="#60A5FA"/>
      <stop offset="0.243919" stopColor="#3B82F6"/>
      <stop offset="0.794452" stopColor="#1D4ED8"/>
      <stop offset="1" stopColor="#172554"/>
      </linearGradient>
      <linearGradient id="paint2_linear_2_7" x1="102" y1="104" x2="661.5" y2="680" gradientUnits="userSpaceOnUse">
      <stop stopColor="#60A5FA"/>
      <stop offset="0.243919" stopColor="#3B82F6"/>
      <stop offset="0.794452" stopColor="#1D4ED8"/>
      <stop offset="1" stopColor="#172554"/>
      </linearGradient>
      <linearGradient id="paint3_linear_2_7" x1="102" y1="104" x2="661.5" y2="680" gradientUnits="userSpaceOnUse">
      <stop stopColor="#60A5FA"/>
      <stop offset="0.243919" stopColor="#3B82F6"/>
      <stop offset="0.794452" stopColor="#1D4ED8"/>
      <stop offset="1" stopColor="#172554"/>
      </linearGradient>
      </defs>
</svg>
       </div>
       </Link> 
        
        
        <div className="navbar-links">
            <Link to="/" className="navbar-link">Home</Link>
            <Link to="/shop" className="navbar-link">Shop</Link>
            <div style={{ position: 'relative', display: 'inline-flex', height: '100%' }}
                onMouseEnter={activateDrop}
                onMouseLeave={closeDrop}
                onClick={handleDrop}>
                <div className="navbar-dropdown"
                 >Categories
                <svg className={openDrop? 'chev-rotate' : 'categories-chev'} width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 8 L12 16 L20 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
                <div className={openDrop ? 'component-drop' : "no-drop"}>
                  <Link className='drop-item' to="/category/electronics">Electronics</Link>
                  <Link className='drop-item' to="/category/Beauty & Personal Care">Beauty & Personal Care</Link>
                  <Link className='drop-item' to="/category/Jewelry">Jewellery</Link>
                  <Link className='drop-item' to="/category/Groceries">Groceries</Link>
                  <Link className='drop-item' to="/category/Home Appliances">Home Appliances</Link>
                  <Link className='drop-link' to="/categories">View all categories 🡪</Link>
                </div>
            </div>
            
            <Link to="/about" className="navbar-link">About</Link>
        </div>

        <div className="navbar-actions">
          <div style={{position: "relative"}}>
          <div
            className={`navbar-search-wrap ${expanded ? 'expanded' : ''}`}
            onMouseEnter={openSearch}
            onMouseLeave={closeSearch}
            onClick={handleWrapClick}>

            <span className="navbar-search-icon">
                <svg width="18" height="18" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="55" cy="55" r="42" fill="none" stroke="currentColor" strokeWidth="8" />
                  <line x1="86" y1="86" x2="112" y2="112" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />
                </svg>
            </span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleChange}
              onBlur={closeSearch}
              onKeyDown={handleKeyDown}
              placeholder="Search products..."
              className="navbar-search-input"
            />
            <div>
              {
                query.trim().length >= 2 && (<div onMouseLeave={()=>setUnblurSuggestion(false)} onMouseEnter={()=>setUnblurSuggestion(true)} className={expanded ? "suggestionDrop" : "no-drop"}>{dropdownContent}</div>)
              }
            </div>
          </div>
          </div>
          <div ref={wrapperRef} style={{ position: 'relative' }}
                className="navbar-profile"
                  onMouseEnter={openProfile}
                  onMouseLeave={closeProfile}
                  onClick={() => setOpen(!open)}>
            <div
            className="navbar-profile">
                <svg width="30" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="100" cy="65" r="32" stroke="#3b3c3d" strokeWidth="8.5" strokeLinecap="round"/>
                    <path
                      d="M 45 170 A 55 55 0 0 1 155 170 L 45 170 Z"
                      stroke="#3b3c3d"
                      strokeWidth="8.5"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                </svg>
            </div>
              <div className={open ? 'profile-drop' : "no-drop"}>
                <div className="account-dropdown-menu">
                  {token ? (
                    <>
                      <Link className="drop-item" to="/orders" onClick={() => setOpen(false)}>
                        My Orders
                      </Link>
                      <Link className="drop-item" to="/account" onClick={() => setOpen(false)}>
                        Account Settings
                      </Link>
                      <button className="account-dropdown-item logout-btn" onClick={handleLogout}>
                        Log Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link className="drop-item" to="/signin" onClick={() => setOpen(false)}>
                        Sign In
                      </Link>
                      <Link className="drop-item" to="/signup" onClick={() => setOpen(false)}>
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            
          </div>
          <Link to="/cart" className="navbar-cart">
               <svg xmlns="http://www.w3.org/2000/svg" width="29" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 5H5.2C5.8 5 6.3 5.4 6.5 6L8.2 13.5C8.4 14.3 9.1 15 10 15H17.5C18.4 15 19.1 14.4 19.3 13.6L20.5 8.5C20.7 7.6 20 7 19.1 7H7.3"
                    stroke="#3b3c3d"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="8.5"
                    cy="18.5"
                    r="1.8"
                    stroke="#3b3c3d"
                    strokeWidth="1.1"
                  />
                  <circle
                    cx="17.5"
                    cy="18.5"
                    r="1.8"
                    stroke="#3b3c3d"
                    strokeWidth="1.1"
                  />
                </svg>
            {cartCount > 0 && <span className="navbar-cart-badge">{cartCount}</span>}
          </Link>
        
        <div ref={hamburgerRef} className='ham-container' style={{ position: 'relative', height: '100%' }}>
        <div className='ham'>
        <svg className='hamburger'
            onClick={toggleList}
            onBlur={closeHamburgerList}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="30"
            fill="none">
            <path
                d="M4 7H20"
                stroke="#3b3c3d"
                strokeWidth="1.4"
                strokeLinecap="round"/>
            <path
                d="M7 12H20"
                stroke="#3b3c3d"
                strokeWidth="1.4"
                strokeLinecap="round"/>
            <path
                d="M10 17H20"
                stroke="#3b3c3d"
                strokeWidth="1.4"
                strokeLinecap="round"/>
        </svg>

        </div>
        <div onMouseLeave={()=>setActiveList(false)} onClick={()=>setActiveList(true)} onMouseEnter={()=>setActiveList(true)} className={openList ? 'list-drop' : "no-drop"}>
                  <Link className='list-item' to="/">Home</Link>
                  <Link className='list-item' to="/shop">Shop</Link>
                  <div style={{ position: 'relative', height: '100%',width:'100%' }}>
                  <div className='list-parent' onClick={toggleListDrop}><div className={listDrop? 'big-list':'list-item'}>Categories </div><div><svg className={listDrop? 'chev-rotate' : 'categories-chev'} width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 8 L12 16 L20 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg></div></div>
                  <div className={listDrop? 'content-list' : 'no-drop'}>
                  <Link className='content-item' to="/category/electronics">Electronics</Link>
                  <Link className='content-item' to="/category/Beauty & Personal Care">Beauty & Personal Care</Link>
                  <Link className='content-item' to="/category/jewelry">Jewellery</Link>
                  <Link className='content-item' to="/category/Groceries">Groceries</Link>
                  <Link className='content-item' to="/category/Home Appliances">Home Appliances</Link>
                  <Link className='list-link' to="/categories">View all categories</Link>
                  </div>
                  </div>
                  <Link className='list-item' to="/about">About</Link>
                  <div className='sign-in' >
                  <svg className='sign-icon' width="25" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="65" r="32" stroke="#3b3c3d" strokeWidth="13" strokeLinecap="round"/>
                    <path
                      d="M 45 170 A 55 55 0 0 1 155 170"
                      stroke="#3b3c3d"
                      strokeWidth="13"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                </svg>
                  <div>
                    <div className={dropDown ? 'inline-profile-drop' : "no-drop"}>
                <div className="account-dropdown-menu">
                  {token ? (
                    <>
                      <Link className="drop-item" to="/orders" onClick={() => setOpen(false)}>
                        My Orders
                      </Link>
                      <Link className="drop-item" to="/account" onClick={() => setOpen(false)}>
                        Account Settings
                      </Link>
                      <button className="account-dropdown-item logout-btn" onClick={handleLogout}>
                        Log Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link className="drop-item" to="/signin" onClick={() => setOpen(false)}>
                        Sign In
                      </Link>
                      <Link className="drop-item" to="/signup" onClick={() => setOpen(false)}>
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>
                  </div>
                  </div>
                  
                </div>
        </div>
        </div>
      </nav>
      
    </>
  );
}
export default Navbar;