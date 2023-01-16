const router = require("express").Router();
// const { application } = require("express")

const { adminOrder } = require("../controllers/index");

router.get("/waitingConfirmation", adminOrder.waitingConfirmation)
router.get("/findOrderStatus", adminOrder.findOrderStatus)
router.get("/findPaymentStatus", adminOrder.findPaymentStatus)
router.get("/findWarehouse", adminOrder.findWarehouse)
router.patch("/approvePayment/:id", adminOrder.approvePayment)
router.patch("/rejectPayment/:id", adminOrder.rejectPayment)
router.patch("/sendOrder/:id", adminOrder.sendOrder)
router.patch("/cancelOrder/:id", adminOrder.cancelOrder)
router.patch("/deliverOrder/:id", adminOrder.deliverOrder)
module.exports = router
