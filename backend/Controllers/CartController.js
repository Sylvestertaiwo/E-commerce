const mongoose = require('mongoose');
const Product = require('../Models/Product.js');
const Cart = require('../Models/Cart.js')
const User = require('../Models/User.js');
const { default: axios } = require('axios');
const crypto = require("crypto");
const Order = require('../Models/Order.js');
const fs = require("fs");
const nodemailer = require('nodemailer');
const frontendUrl = process.env.FRONT_END_URL

const getCart = async (req, res)=>{
    try{
        const cartItem = await Cart.find({user: req.userId}).populate("product")
        if(!cartItem || cartItem.length === 0){
            return res.status(200).json({
              status: true,
              message: "Nothing in cart. Add your first!",
              cartItem: [],
              totalAmount: 0
            });
        }
        let totalAmount = 0;

        cartItem.forEach((c) => {
            totalAmount += c.product.retailPrice * c.quantity;
        });
        res.json({status:true, cartItem, totalAmount})
    }catch(err){
        res.status(500).json({status: false, message: "unable to fetch cart"})
    }
}
const addtoCart = async (req, res)=>{
    try{
        const { productId, quantity } = req.body
        const existingCart = await Cart.findOne({user: req.userId, product: productId});
        if(existingCart){
            const existingCartRes =  await Cart.findOneAndUpdate({user: req.userId, product: productId}, {$inc: { quantity: Number(quantity) }}, { new: true });
            return res.send({status:true, message: "cart updated successfully", existingCartRes})
        }
        const newCart = await Cart.create({user: req.userId, product: productId, quantity})
        return res.send({status:true, message: "cart updated successfully", newCart})
    }catch(err){
        res.status(500).json({status:false, message: "unable to add to cart"})
    }
}
const updateQuantity  = async (req,res)=>{
    try{
        const newQuantity = req.body.quantity;
        const updatedCart = await Cart.findOneAndUpdate({_id: req.params.id, user: req.userId}, {quantity: Number(newQuantity)}, {new: true})
        if (!updatedCart) {
          return res.status(400).json({ status: false, message: "Cart item not found" });
        }
        return res.json({status: true, message: "cart updated successfully", updatedCart});
    }catch(err){
        return res.status(500).json({status:false, message: "unable to update cart"});
    }
}
const  removeFromCart = async(req,res)=>{
    try{
        const deletedCart = await Cart.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if (!deletedCart) {
          return res.status(404).json({ status: false, message: "Cart item not found" });
        }
        return res.json({status:true, message: "item deleted successfully"})
    }catch(err){
        return res.status(500).json({status:false, message: "unable to delete item"});
    }

}
const getOrder = async (req,res)=>{
  try{
    const { shippingAddress } = req.body;
    const cartItems = await Cart.find({ user: req.userId }).populate('product');
    const user = await User.findById(req.userId);
    if (cartItems.length === 0) {
      return res.status(400).json({ status: false, message: "Your cart is empty" });
    }
    let totalAmount = 0;
    const orderItems = cartItems.map((c) => {
        const itemTotal = c.product.retailPrice * c.quantity;
        totalAmount += itemTotal;
        return {
          product: c.product._id,
          price: c.product.retailPrice,
          quantity: c.quantity,
        };
      });
      
    const reference = crypto.randomBytes(12).toString('hex');

    const newOrder = await Order.create({
      user: req.userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paystackRef: reference,
      paymentStatus: 'pending',
    });
    const paystackRes = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: user.email,
        amount: totalAmount * 100,
        reference: reference,
        callback_url: "http://localhost:5173/verify"
      },
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
      }
    );
    const {authorization_url} = paystackRes.data.data;
    return res.json({ status: true, authorization_url, orderId: newOrder._id });
  } catch (err) {
    console.error("Checkout error:", err.response?.data || err.message);
    res.status(500).json({ status: false, message: "Checkout failed" });
  }
}
const confirmPayment = async (req, res)=>{
try{
    const {reference}= req.params;

    const paystackref = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`,{ headers:  {Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`}})
    // console.log("Step 2: Paystack responded:", paystackref.data);

    if(paystackref.data.data.status === "failed" || paystackref.data.data.status === "abandoned" ){
        await Order.findOneAndUpdate({paystackRef: reference}, {paymentStatus: "failed"}, {new: true})
        return res.status(500).json({status: false, message: "transaction failed"})
    }else  if(paystackref.data.data.status === "pending"){
        await Order.findOneAndUpdate({paystackRef: reference}, {paymentStatus: "pending"}, {new: true})
        return res.status(501).json({status: false, message: "transaction pending"})
    }else if(paystackref.data.data.status === "success"){

    const updatedOrder = await Order.findOneAndUpdate({paystackRef: reference}, {paymentStatus: "paid"}, {new:true}).populate('items.product').populate('user');
    await Cart.deleteMany({user: updatedOrder.user._id})

    const itemsRows = updatedOrder.items.map(item => `
        <tr>
            <td style="padding:12px 0; border-bottom:1px solid #f1f2f5; color:#14161e; font-size:14px;">${item.product.name}</td>
            <td align="center" style="padding:12px 0; border-bottom:1px solid #f1f2f5; color:#14161e; font-size:14px;">${item.quantity}</td>
            <td align="right" style="padding:12px 0; border-bottom:1px solid #f1f2f5; color:#14161e; font-size:14px;">₦${item.price.toLocaleString()}</td>
        </tr>
        `).join('');

    let emailHtml = fs.readFileSync('./order-confirmation-email.html', 'utf-8');
    emailHtml = emailHtml
        .replace('{{customerName}}', updatedOrder.user.firstname)
        .replace('{{orderId}}', updatedOrder._id)
        .replace('{{orderDate}}', new Date(updatedOrder.createdAt).toLocaleDateString())
        .replace('{{shippingAddress}}', updatedOrder.shippingAddress)
        .replace(/<!-- \{\{itemsRows\}\}[\s\S]*?end repeat -->/, itemsRows)
        .replace('{{totalAmount}}', updatedOrder.totalAmount.toLocaleString())
        .replace('{{ordersUrl}}', `${frontendUrl}/orders`);

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: `Sly <${process.env.EMAIL}>`,
            to: updatedOrder.user.email,
            subject: `Order Confirmed — ${updatedOrder._id}`,
            html: emailHtml,
        });
        
    } catch (emailErr) {
        console.error("Email failed to send, but payment succeeded:", emailErr.message);
    }
    return res.json({status: true, message: "transaction successfull"})
}else{
        await Order.findOneAndUpdate({paystackRef: reference}, {paymentStatus: "pending"}, {new: true})
        return res.status(202).json({status: false, message: `Payment status: ${paystackref.data.data.status}. Please check back shortly.`})
    }
}catch(err){
    console.log("Step ERROR:", err.message);
    res.status(500).json({status: false, message : "unable to verify payment, transaction failed!"})
}
}
const getOrders = async (req, res) => { 
  try {
    const orders = await Order.find({ user: req.userId })
      .populate('items.product')
      .sort({ createdAt: -1 });

    return res.json({ status: true, orders });
  } catch (err) {
    console.error("Unable to fetch orders:", err.message);
    return res.status(500).json({ status: false, message: "Unable to fetch orders" });
  }
};
const getCount = async (req,res)=>{
    try{
        const userCart = await Cart.find({user: req.userId})
        const userCount = userCart.length
        res.json({status: true, count: userCount})
    }catch(err){
        console.error(err);
        res.status(500).json({status: false, message: "Server error. Please try again"})
    }
}   
module.exports = {getCart, addtoCart, updateQuantity, removeFromCart, getOrder, confirmPayment, getOrders, getCount}