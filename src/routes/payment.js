const express = require("express");
const { check } = require("express-validator");
const globalPaymentController = require("../controllers/payment");
const router = express.Router();

router.post("/createPayment", globalPaymentController.createPayment);
router.get("/getPayments/:userId", globalPaymentController.getPayments);
router.put("/updatePayment/:idPayment", globalPaymentController.updatePayment);
router.get("/getMetrics/:userId", globalPaymentController.getMetrics);
module.exports = router;
