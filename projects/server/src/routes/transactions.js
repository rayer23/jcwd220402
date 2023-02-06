const router = require("express").Router();
const { transactions } = require("../controllers/index");
const { upload } = require("../helpers/uploader");

router.get("/checkoutCartItems", transactions.checkoutCartItems)
router.post("/payItems", transactions.createNewTransaction)
router.get("/name", transactions.getTransactionByTransactionName)
router.post(
    "/payment-proof/:transaction_name",
    upload({
        acceptedFileTypes: ["png", "jpeg", "jpg"],
        filePrefix: "PAY",
    }).single("payment_proof"),
    transactions.paymentProofUpload
)
router.patch(
    "/payment-expired/:transaction_name",
    transactions.setPaymentExpired
)
router.get("/all-transaction-list", transactions.getAllMyTransaction)
router.get("/transaction-list", transactions.getMyTransactionList)
router.get("/unpaid-transaction", transactions.getUnpaidTransaction)
router.patch(
    "/finish-order/:transaction_name",
    transactions.finishTransactionHandler
)

router.patch(
    "/cancel-unpaid-transaction/:transaction_name",
    transactions.cancelUnpaidTransactionHandler
)
router.patch(
    "/cancel-paid-transaction/:transaction_name",
    transactions.cancelPaidTransactionHandler
)
module.exports = router

