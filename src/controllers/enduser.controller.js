const User = require("../models/user.model.js")
const Order = require("../models/order.model.js")
const Printer = require("../models/printer.model.js")
const Report = require("../models/report.model.js")


/*
    Purpose: View available printers printers
*/ 
const viewPrinter = async (req, res) => {
    try {
        const printer = await Printer.find({"isActivated": true}).exec()
        res.status(200).json(printer);
    } catch (e) {
        res.status(400).json({ message: "View printer failed!" });
        console.log(e)
    }
} 

/*
    Purpose: Add new order
    Body:
        size: String (paper's size)
        nb_papers: Number (number of pages)
        face: Number (one/two faces)
        printer: ObjectID (printer's id)
    User:
        user: ObjectID (user's id)
*/ 
const addOrder = async (req, res) => {
    const user = req.user
    const body = req.body
    try {
        // Decrement papers
        const paper_find = {"_id": user._id}
        const paper_update = {
            "$inc": {
                "paper_credit": body.nb_papers
                }
        }
        await User.findOneAndUpdate(paper_find, paper_update)
        // Add new orders
        const order = {
            created_date: new Date().toISOString(),
            size: body.size,
            nb_papers: body.nb_papers,
            face: body.face,
            printer: body.printer_id,
            user: user._id
        }
        const newOrder = await new Order(order)
        await newOrder.save()
        // Add new entries to history
        order["last_updated"] = new Date.toISOString()
        order["process_status"] = "order created"
        order["process_msg"] = "Waiting for confirmation!"
        const find_filter = {"_id": id}
        const update_filter = {"$push": {"history": order}}
        const newHistory = await User.findOneAndUpdate(find_filter, update_filter)
        res.status(201).json({ message: "Add successfully", newOrder });
      } catch (e) {
        res.status(400).send(e);
    }
}

/*
    Purpose: Remove an order in order queue
    Body:
        size: String (paper's size)
        nb_papers: Number (number of pages)
        face: Number (one/two faces)
        printer: ObjectID (printer's id)
    User:
        user: ObjectID (user's id)
*/ 
const deleteOrder = async (req, res) => {
    const { id } = req.params
    const user = req.user
    const body = req.body
    try {
        // Remove order
        const find_filter = {"_id": id}
        const deleted_order = await Order.deleteOne(find_filter)
        if (!deleted_order){
            return res.status(404).json({ message: "Delete order failed!"});
        }
        const order_obj = deleted_order.toObject() 
        // Refund papers
        // Update user's history
        const history_find_filter = {"_id": id, "history.$._id": deleted_order._id}
        const history_update_filter = {
            "$set":{
                "history.$.last_updated": new Date.toISOString(),
                "history.$.process_status": "order deleted"
            }
        }
        const newHistory = await User.findOneAndUpdate(history_find_filter, history_update_filter)
        res.status(201).json({ message: "Delete order successfully!"});
      } catch (e) {
        res.status(400).send(e);
    }
}


/*
    Purpose: Add paper's to user's credit
    Body:
        amount: Number (Number of paper to add)
    User:
        user: ObjectID (user's id)
*/ 
const purchasePaper = async (req, res) => {
    try {
        const id = req.user._id;
        const amount = req.body.amount
        const find_filter = { "_id": id };
        const update_filter = { $inc: { 'paper_credit': amount } };
        const option = { new: true };
        const result = await User.updateOne(find_filter, update_filter, option);
        if (!result) {
            return res.status(404).send();
        }
        res.json(result);
    } catch (e) {
        res.status(400).send(e);
    }
}

/*
    Purpose: Create a user's report
    Body:
        title: String
        type: String
        description: String
    User:
        user: ObjectID (user's id)
*/ 
const createReport = async (req, res) => {
    const body = req.body
    try {
        const newReport = await new Report({
            title: body.title,
            type: body.type,
            date: new Date().toISOString(),
            description: body.description
        })
        await newReport.save()
        res.status(201).json({ message: "Add successfully", newOrder });
      } catch (e) {
        res.status(400).send(e);
    }
}

module.exports = {
    viewPrinter,
    createReport,
    purchasePaper,
    addOrder,
    deleteOrder
}