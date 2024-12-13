const Printer = require("../models/printer.js")
const Order = require("../models/order.js").orderModel
const Report = require("../models/report.js")
const User = require("../models/Users.js")

const viewPrinter = async (req, res) => {
    const body = req.body
    try {
        const printer = await Printer.find().exec()
        res.status(200).json(printer);
    } catch (e) {
        res.status(400).json({ message: "View printer failed!" });
        console.log(e)
    }
} 

const addPrinter = async (req, res) => {
    const body = req.body
    try {
        const newPrinter = await new Printer({
            'name': body.name,
            'type': body.type,
            'location': body.location,
            'isActivated': body.isActivated,
            'description': body.description
        })
        await newPrinter.save()
        res.status(201).json({ message: "Add successfully", newPrinter });
    } catch (e) {
        res.status(400).json({ message: "Adding printer failed!" });
        console.log(e)
    }
}

const deletePrinter = async (req, res) => {
    const params = req.params
    try {
        const find_filetr = { "_id": params.id }
        const printer = await Printer.findOneAndDelete(find_filter)
        if (!printer) {
            return res.status(404).json({ message: "Printer not found." });
        }
        res.status(200).json({ message: "Printer deleted successfully." });
    }
    catch (e) {
        res.statues(400).error(e)
    }
}

const editPrinter = async (req, res) => {
    const { id } = req.params
    const body = req.body
    try {
        const find_filter = { "_id": id }
        const update_filter = {
            'name': body.name,
            'type': body.type,
            'location': body.location,
            'isActivated': body.isActivated,
            'description': body.description
        }
        const option_filer = { "new": true }
        const printer = await Printer.findOneAndUpdate(find_filter, update_filter, option_filer)
        if (!printer) {
            res.status(404).json({ message: "Printer not exist!" })
        }
        res.status(204).json(printer)
    } catch (e) {
        res.status(400).json({ message: "Edit printer failed!" });
        console.log(e)
    }
}

// Require a params and a body
// Params:
// id: ObjectID (order's id)
const acceptOrder = async (req, res) => {
    const { id } = req.params
    const body = req.body
    try {
        const order_find_filter = { "_id": id }
        const order = await Order.findOne(order_find_filter)
        if (!order){
            throw "Find order failed!"
        }
        const orderRecord = order.toObject()

        // Add order to printer's queue
        const printer_find_filter = {"_id": orderRecord.printer}
        const printer_update_filter = {"$push": {"order_queue": orderRecord}} // append order record to printer's queue list
        const printer_option_filter = {"new": true}
        const updatedPrinter = await Printer.updateOne(printer_find_filter, printer_update_filter, printer_option_filter)
        if (!updatedPrinter) {
            throw "Update printer's queue failed!"
        }
        // TODO: Announce to user their history has been updated
        const history_find_filter = {
            "_id": id,
            "history.$._id": orderRecord._id
        }
        const history_update_filter = {
            "$set":{
                "history.$.last_updated": new Date.toISOString(),
                "history.$.process_status": "order confirmed",
                "history.$.process_msg": body.reason,
            }
        }

        const updatedHistory = await User.findOneAndUpdate(history_find_filter, history_option_filter, history_update_filter)
        if (!updatedHistory){
            throw "Cannot find user with such order!"
        }

        // Remove the old record from order queue
        const deleteOrder = await Order.deleteOne(order_find_filter)
        if (!deleteOrder){
            throw "Delete order failed!"
        }
        res.status(204).json(order)
    } catch (e) {
        res.status(400).json({ message: "Confirm order failed! Reason: " + e.toString()}) ;
        console.log(e)
    }
}

// Require a params and a body
// Params:
// id: ObjectID (order's id)
// Body:
// reason: String (user's input)
const refuseOrder = async (req, res) => {
    const { id } = req.params
    const body = req.body
    try {
        const order_find_filter = { "_id": id }
        const order = await Order.findOne(order_find_filter)
        if (!order){
            throw "Find order failed!"
        }
        const orderRecord = order.toObject()

        // TODO: Announce to user their history has been updated
        const history_find_filter = {
            "_id": id,
            "history.$._id": orderRecord._id
        }
        const history_update_filter = {
            "$set":{
                "history.$.last_updated": new Date.toISOString(),
                "history.$.process_status": "order refused",
                "history.$.process_msg": body.reason,
            }
        }

        const updatedHistory = await User.findOneAndUpdate(history_find_filter, history_option_filter, history_update_filter)
        if (!updatedHistory){
            throw "Cannot find user with such order!"
        }
        
        // Remove the old record from order queue
        const deleteOrder = await Order.deleteOne(order_find_filter)
        if (!deleteOrder){
            throw "Delete order failed!"
        }
        res.status(204).json(order)
    } catch (e) {
        res.status(400).json({ message: "Confirm order failed!" + e.toString() });
        console.log(e)
    }
}

const viewOrder = async (req, res) => {
    const body = req.body
    try {
        const order = await Order.find()
        res.status(200).json(order)
    } catch (e) {
        res.status(400).json({ message: "View order failed!" });
        console.log(e)
    }
}

const viewReport = async (req, res) => {
    const body = req.body
    try {
        const find_filter = {"isResolved": false}
        const reports = await Report.find(find_filter).exec()
        res.status(200).json(reports)
    } catch (e) {
        res.status(400).json({ message: "View report failed!" });
        console.log(e)
    }
}

const resolveReport = async (req, res) => {
    const { id } = req.params
    try {
        find_filter = {"_id": id}
        update_filter = {"isResolved": true}
        option_filter = {new: true}
        const reports = await Report.findOneAndUpdate(find_filter, update_filter, option_filter)
        if (!reports)
            res.status(404).json({message: "Cannot find report with such id!"})
        res.status(204).json(reports)
    } catch (e) {
        res.status(400).json({ message: "Cannot resolve report!" });
        console.log(e)
    }
}

module.exports = {
    viewPrinter,
    addPrinter,
    deletePrinter,
    editPrinter,
    viewOrder,
    acceptOrder,
    refuseOrder,
    viewReport,
    resolveReport
}