const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")

const allowedOrigins = [
  process.env.FRONT_END_URL,
  'http://localhost:5173' 
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
require('dotenv').config({path: '../.env'});
const MongoDB_URI = process.env.MONGO_DB_URI
const Port = process.env.PORT
app.use(express.json())
app.use(express.urlencoded({extended:true}))
mongoose.connect(MongoDB_URI)
.then(()=>{
    console.log("connected to mongoDB successfully")
}).catch((err)=>{
    console.log("unable to connect to mongoDB", err.message)
})
const clientsRoute = require("./Routes/ClientRoute.js")
app.use("/", clientsRoute)

const authRoute = require("./Routes/AuthRoute.js")
app.use("/auth", authRoute)

const cartRoute = require("./Routes/CartRoute.js")
app.use("/cart", cartRoute )
let server = app.listen(Port, ()=>{
    console.log(`server connected succesfully at port: ${Port}`)
})

server.on("error", (err)=>{
    console.log(`Unable to host at port: ${Port}`, err.message)
})