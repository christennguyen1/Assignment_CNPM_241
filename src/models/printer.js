const mongoose = require("mongoose");
const orderSchema = require("./order").Schema
const printerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
    },
    location:{
        type: String,
        required: true
    },
    isActivated:{
        type: Boolean,
        required: true
    },
    description:{
        type: String,
    },
    order_queue: {
        type: [orderSchema]
    }

});
const printerModel = mongoose.model('printer', printerSchema);
module.exports = printerModel