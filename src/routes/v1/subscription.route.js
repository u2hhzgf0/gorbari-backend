const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const { subscriptionController, transactionController } = require("../../controllers");
const userFileUploadMiddleware = require("../../middlewares/fileUpload");
const convertHeicToPngMiddleware = require("../../middlewares/converter");
const UPLOADS_FOLDER_GATEWAY = "./public/uploads/other";

const uploadGateway = userFileUploadMiddleware(UPLOADS_FOLDER_GATEWAY);

const router = express.Router();

router
  .route("/transactions")
  .get(auth("admin"),  transactionController.transactionList);

router
  .route("/")
  .get(subscriptionController.subscriptionList)
  .post(auth("admin"), subscriptionController.subscriptionCreate);

router
  .route("/:id")
  .get(auth("admin"), subscriptionController.subscriptionGetById)
  .patch(auth("admin"), subscriptionController.subscriptionUpdateById)
  .delete(auth("admin"), subscriptionController.subscriptionDeleteById);

router
  .route("/take")
  .post(
    auth("common"),
    [uploadGateway.single("screenshot")],
    convertHeicToPngMiddleware(UPLOADS_FOLDER_GATEWAY),
    subscriptionController.takeSubscription
  );

router
  .route("/approve")
  .post(auth("admin"), subscriptionController.approvedSubscriptions);

router
  .route("/reject")
  .post(auth("admin"), subscriptionController.rejectSubscriptions);

module.exports = router;
