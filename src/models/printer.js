const mongoose = require("mongoose");
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
    }

});
const printerModel = mongoose.model('printer', printerSchema);
module.exports = printerModel