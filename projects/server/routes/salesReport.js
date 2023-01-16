const router = require("express").Router();
const { salesReport } = require("../controllers/index");

router.get("/get", salesReport.getReport);
router.get("/get2", salesReport.getReportWithQuery);

module.exports = router;
