const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const { subscriptionController } = require("../../controllers");

const router = express.Router();

router
  .route("/")
  .get(subscriptionController.subscriptionList)
  .post(auth("admin"), subscriptionController.subscriptionCreate);



router
  .route("/take")
  .post(auth("common"), subscriptionController.takeSubscription);

router
  .route("/:id")
  .get(auth("admin"), subscriptionController.subscriptionGetById)
  .patch(auth("admin"), subscriptionController.subscriptionUpdateById)
  .delete(auth("admin"), subscriptionController.subscriptionDeleteById);

module.exports = router;
