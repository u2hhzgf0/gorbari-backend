const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const { paymentGatewayController } = require("../../controllers");
const userFileUploadMiddleware = require("../../middlewares/fileUpload");
const convertHeicToPngMiddleware = require("../../middlewares/converter");
const UPLOADS_FOLDER_GATEWAY = "./public/uploads/other";

const uploadGateway = userFileUploadMiddleware(UPLOADS_FOLDER_GATEWAY);

const router = express.Router();

router
  .route("/")
  .get(paymentGatewayController.listGateways)
  .post(
    auth("admin"),
    [uploadGateway.single("logo")],
    convertHeicToPngMiddleware(UPLOADS_FOLDER_GATEWAY),
    paymentGatewayController.createGateway
  );

router
  .route("/:id")
  .get(auth("admin"), paymentGatewayController.getGatewayById)
  .patch(
    auth("admin"),
    [uploadGateway.single("logo")],
    convertHeicToPngMiddleware(UPLOADS_FOLDER_GATEWAY),
    paymentGatewayController.updateGatewayById
  )
  .delete(auth("admin"), paymentGatewayController.deleteGatewayById);

module.exports = router;

module.exports = router;
