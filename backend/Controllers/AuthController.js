const bcrypt = require('bcryptjs');  

const jwt = require('jsonwebtoken');  
const User = require('../Models/User');
const { findByIdAndUpdate } = require('../Models/Cart');
const { findById } = require('../Models/Product');
const JWT_SECRET = process.env.JWT_SECRET;

const signToken = (user)=>{
    return jwt.sign({id : user._id}, JWT_SECRET, {expiresIn:"7d"})
}
const signup = async (req,res)=>{
    try{
        const {firstname, lastname, email, password} = req.body;
        if(!firstname) {
            return res.status(400).json({ message: 'firstname is required' });
        }
        if(!email){
            return res.status(400).json({ message: 'email is required.' });
        }
        if(!password){
            return res.status(400).json({ message: 'password is required.' });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters.' });
        }
        
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(400).json({ message: 'An account with this email already exists.' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            firstname,
            lastname,
            email: email.toLowerCase(),
            password: hashedPassword,
        })
        const token = signToken(user);
        res.json({status:true, token, newUser: {id:user._id, email: user.email, firstname: user.firstname, lastname: user.lastname}})
    }catch(err){
        console.error('Unable to signup', err);
        res.status(500).json({ message: 'Signup failed. Please try again.' });
    }
}
const login = async (req,res)=>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email: email.toLowerCase()});  
        if(!user){
            return res.status(400).json({message: "Invalid email or password"})
        }
        const verified = await bcrypt.compare(password, user.password);
        if(!verified){
            return res.json({status:false, message: "Invalid email or password"})
        }

            const token = signToken(user);
            res.json({status:true, message: "password verified", token})
    }catch(err){
        console.error('Unable to login', err);
        res.status(500).json({ message: 'Login failed. Please try again.' });
    }
}
const requireAuth = (req, res, next)=>{
  try{
      const authHeader = req.headers.authorization
      
      if(!authHeader){
        
        return res.status(400).json({message: "invalid token", status:false})
      }
  const token = req.headers.authorization.split(" ")[1]
  
  if(!token){
    
    return res.status(400).json({message: "invalid token", status: false})
  }
  jwt.verify(token, JWT_SECRET, (err, verified)=>{
    
   if(err){
       return res.status(400).json({message: "invalid token", status: false})
   }
   req.userId = verified.id;
   next()
  })
  }catch(err){
    
    res.status(500).json({status: false, message: "Unable to verify, pls try again"})
  }
}
const getUser = async (req,res)=>{
    try{
        const user = await User.findById(req.userId).select('-password')
        if(!user){
            return res.status(401).json({status: false, message: "User doesn't exist!"})
        }
        res.json({status: true, user})
    }catch{
        res.status(500).json({status:false, message:"Unable to verify user. Try again!"})
    }
}
const updateUser = async (req, res)=>{
    let value = req.body;
    try{
        const user = await User.findByIdAndUpdate(req.userId, {firstname: value.firstname, lastname: value.lastname, email: value.email}, {new:true}).select('-password')
        if(!user){
            return res.status(404).json({status:false, message: "user doesnt exist"})
        }
        res.json({status: true, user})
    }catch{
        res.status(500).json({status:false, message:"Unable to verify user. Try again!"})
    }
}
const updatePassword = async (req, res)=>{
    try{
        let user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({status: false, message: "User doesn't exist"});
        }
        let password = req.body.password;
        let verified = await bcrypt.compare(password, user.password)
        if(!verified){
            return res.status(401).json({status:false, message: "Invalid User password"})
        }
        let newpassword = req.body.newpassword;
        const hashedPassword = await bcrypt.hash(newpassword, 10)
        const updatedUser = await User.findByIdAndUpdate(req.userId, {password: hashedPassword}, {new:true}).select('-password')
        res.json({status:true, updatedUser})
    }catch{
        res.status(500).json({status: false, message: "unable to update password, Try again."})
    }
}
module.exports = {signup, login, requireAuth, getUser, updateUser, updatePassword}