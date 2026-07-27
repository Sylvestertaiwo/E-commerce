const mongoose = require("mongoose")
const orderSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    paymentStatus: {type: String, enum: ['paid', 'failed', 'pending'], default: 'pending'},
    totalAmount: {type: Number, required: true},
    shippingAddress : {type: String, required : true},
    paystackRef : {type: String, required:true},
    items : [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        price: {type:Number, required:true},
        quantity :{type:Number, required: true}
    }]
}, { timestamps: true })

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
