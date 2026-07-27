import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Categories from './components/Categories'
import axios from 'axios'
import { Route, Routes } from 'react-router-dom'
import ProductListing from './components/ProductListing'
import ProductDetail from './components/ProductDetail'
import SearchResult from './components/SearchResult'
import SignUp from './components/SignUp'
import LogIn from './components/LogIn'
import Cart from './components/Cart'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Checkout from './components/Checkout'
import Verify from './components/Verify'
import MyOrders from './components/MyOrders'
import NotFound from './components/NotFound'
import Account from './components/Account'
import EditProfile from './components/EditProfile'
import ChangePassword from './components/ChangePassword'
import About from './components/About'
import { CartProvider } from './components/CartContext'

const App = () => {
  
  return (
    <>
    <CartProvider>
    <Routes>
      <Route path='/' element={<Hero/>}></Route>
      <Route path='/about' element={<About/>}></Route>
      <Route path='/account' element={<Account/>}/>
      <Route path='/account/edit' element={<EditProfile/>}/>
      <Route path='/account/password' element={<ChangePassword/>}/>
      <Route path='/categories' element={<Categories/>}></Route>
      <Route path='/signup' element={<SignUp/>}></Route>
      <Route path='/signin' element={<LogIn/>}></Route>
      <Route path='/cart' element={<Cart/>}></Route>
      <Route path='/shop' element={<ProductListing/>}></Route>
      <Route path='/search' element={<SearchResult/>}></Route>
      <Route path='/verify' element={<Verify/>}></Route>
      <Route path="/orders" element={<MyOrders />} />
      <Route path='/checkout' element={<Checkout/>}></Route>
      <Route path='/category/:category' element={<ProductListing/>}></Route>
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path='*' element={<NotFound/>}/>
    </Routes>
    <ToastContainer icon={false}/>
    </CartProvider>

      
    </>
  )
}

export default App