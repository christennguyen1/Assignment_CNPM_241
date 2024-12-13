const express = require("express");
const enduserController = require("../controllers/enduser.controller");
const router = express.Router();

//Printing
router.get('/view-printer', enduserController.viewPrinter);
router.put('/add-order', enduserController.addOrder);
router.post('/delete-order', enduserController.deleteOrder)

//Paper
router.post('/purchase-paper/:id', enduserController.purchasePaper)

//Report
router.put('/create-report/:id', enduserController.createReport)

module.exports = router;
