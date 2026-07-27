const mongoose = require('mongoose');
const Product = require('../Models/Product.js');
const Cart = require('../Models/Cart.js');
const User = require('../Models/User.js');
const { default: axios } = require('axios');
const crypto = require("crypto")
const categoriesInfo = (req, res)=>{
    try{
        Product.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $project: { category: '$_id', count: 1, _id: 0 } }, 
            { $sort: { category: 1 } },
        ])
        .then((response)=>{
            res.send({status:true, message: response})
        })
        .catch((err)=>{
            res.send({status:false, message: err.message})
        })}
        catch{
        res.send({status: false})
    }
};

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const productInfo = async (req, res)=>{
  try{
    const { search, category, minPrice, maxPrice, sort, page = 1, limit = 20 } = req.query;
    const filter = {}
    if (search){
      const safeSearch = escapeRegex(search)
      filter.name = {$regex: safeSearch, $options: "i"}
    }
    if(category){
      const safeCategory = escapeRegex(category)
      filter.category = {$regex: `^${safeCategory}$`, $options: "i"}
    }
    if(minPrice || maxPrice){
      filter.retailPrice = {}
      if(minPrice) filter.retailPrice.$gte = Number(minPrice)
      if(maxPrice) filter.retailPrice.$lte = Number(maxPrice)
    }
    let sortOption = { createdAt: -1 };

    if (sort === "price_asc") sortOption = { retailPrice: 1 };
    if (sort === "price_desc") sortOption = { retailPrice: -1 };
    if (sort === "name_asc") sortOption = { name: 1 };

    const pageNum = Math.max(Number(page), 1)
    const limitNum = Math.max(Number(limit), 1)
    const skipPage = (pageNum - 1)*limitNum

    const [product, productNum] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skipPage).limit(limitNum),
      Product.countDocuments(filter)
    ])

    const totalPages = Math.ceil(productNum / limitNum)
    // console.log({product: product, pageNum : product, limitNum : limitNum, productNum : productNum})
    res.json({
     product,
     pagination: {
       currentPage: pageNum,
       totalPages: Math.ceil(productNum / limitNum),
       productNum,
       limit: limitNum,
     }
   });
   } catch (err) {
     console.error("GET /products error:", err);
     res.status(500).json({ message: "Failed to fetch products" });
   }

}

const productID = async (req, res)=>{
  try{
    const product = await Product.findById(req.params.id);
    if(!product) 
    return res.status(404).json({ message: "Product not found" });
    res.json({product})
  }catch(err){
    res.json({status: false, message: err.message})
  }
}

const relatedProduct = async (req, res)=>{
  try{
    const product = await Product.findById(req.params.id)
    if (!product) 
      return res.status(404).json({message: "Product not found"})
      const safeCategory = escapeRegex(product.category)
      const filter = {
        category: { $regex: `^${safeCategory}$`, $options: "i" },
        _id: { $ne: product._id }
      }

    const relatedResult = await Product.find(filter).limit(8)  
    res.json({status:true, relatedResult})
      
  }catch(err){
    res.json({status:false, message: err.message})
  }
}

const productSuggestion = async (req, res)=>{
  try{
  const {search} = req.query
  if (!search || search.trim().length < 2) {
  return res.json({status: false});
  }
  const safeSearch = escapeRegex(search.trim())
  const filter = {
    name : {$regex: safeSearch, $options: "i"}
  }
  const response = await Product.find(filter, { name: 1, images: 1, retailPrice: 1, category: 1 }).limit(6)
  res.json({status: true, response})
  }catch(err){
    res.status(500).json({status:false, message: err.message})
  }
}

module.exports = {categoriesInfo, productInfo, productID, relatedProduct, productSuggestion}
