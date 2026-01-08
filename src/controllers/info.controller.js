const httpStatus = require("http-status");
const pick = require("../utils/pick");
const response = require("../config/response");
const { infoService } = require("../services");
const catchAsync = require("../utils/catchAsync");

const createFavorite = catchAsync(async (req, res) => {
  req.body.user = req.user.id;

  const favorite = await infoService.createFavorite(req.body);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Favorite Saved",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: favorite,
    })
  );
});

const getFavorites = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["user", "property"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);

  const result = await infoService.queryFavorites(filter, options, req.user.id);

  res.status(httpStatus.OK).json(
    response({
      message: "All Favorites",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

const getFavoriteById = catchAsync(async (req, res) => {
  const favorite = await infoService.getFavoriteById(req.params.favoriteId);

  res.status(httpStatus.OK).json(
    response({
      message: "Favorite Found",
      status: "OK",
      statusCode: httpStatus.OK,
      data: favorite,
    })
  );
});

const updateFavorite = catchAsync(async (req, res) => {
  const favorite = await infoService.updateFavoriteById(
    req.params.favoriteId,
    req.body
  );

  res.status(httpStatus.OK).json(
    response({
      message: "Favorite Updated",
      status: "OK",
      statusCode: httpStatus.OK,
      data: favorite,
    })
  );
});

const removeFavorite = catchAsync(async (req, res) => {
  await infoService.deleteFavoriteByProperty(req.body.property);

  res.status(httpStatus.OK).json(
    response({
      message: "Property removed from favorite",
      status: "OK",
      statusCode: httpStatus.OK,
      data: null,
    })
  );
});

const deleteFavorite = catchAsync(async (req, res) => {
  await infoService.deleteFavoriteById(req.params.favoriteId);

  res.status(httpStatus.OK).json(
    response({
      message: "Favorite Deleted",
      status: "OK",
      statusCode: httpStatus.OK,
      data: null,
    })
  );
});

const getAllStatus = catchAsync(async (req, res) => {
  const result = await infoService.getAllStatus(req.query.year, req.user);

  res.status(httpStatus.OK).json(
    response({
      message: "All Status",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

module.exports = {
  createFavorite,
  getFavorites,
  getFavoriteById,
  updateFavorite,
  deleteFavorite,
  removeFavorite,

  getAllStatus
};
