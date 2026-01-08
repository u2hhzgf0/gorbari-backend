const express = require("express");
const auth = require("../../middlewares/auth");
const { infoController } = require("../../controllers");

const router = express.Router();

// Favorite routes
router
  .route("/favorite")
  .post(auth("common"), infoController.createFavorite)
  .get(auth("common"), infoController.getFavorites)
  .delete(auth("common"), infoController.removeFavorite);


router
  .route("/favorite/:favoriteId")
  .get(auth("common"), infoController.getFavoriteById)
  .patch(auth("common"), infoController.updateFavorite)
  .delete(auth("common"), infoController.deleteFavorite);


  router
  .route("/deshbord/status")
  .get(auth("adminAndAgent"), infoController.getAllStatus)

module.exports = router;
