const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const { contactController } = require("../../controllers");

router.route("/").post(contactController.createContact);
router.route("/").get(auth("admin"), contactController.getContacts);
router
  .route("/:contactId")
  .get(auth("adminAndAgent"), contactController.getContact);

module.exports = router;
