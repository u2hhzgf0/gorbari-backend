const httpStatus = require("http-status");
const { Favorite } = require("../models");
const ApiError = require("../utils/ApiError");

const createFavorite = async (favoriteBody) => {
  if (favoriteBody.property) {
    const isAlreadyFavorite = await Favorite.findOne({
      property: favoriteBody.property,
      user: favoriteBody.user,
      isDeleted: false,
    });
    if (isAlreadyFavorite) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Property is already in favorites"
      );
    }
  }

  return Favorite.create(favoriteBody);
};

const queryFavorites = async (filter, options, userId) => {
  const query = {  user: userId, isDeleted: false };

  for (const key of Object.keys(filter)) {
    if (filter[key] !== "") {
      query[key] = filter[key];
    }
  }

  const favorites = await Favorite.paginate(query, options);
  return favorites;
};

const getFavoriteById = async (id) => {
  return Favorite.findOne({ _id: id, isDeleted: false })
    .populate("user", "fullName email profileImage")
    .populate("property");
};

const getFavoriteByProperty = async (id) => {
  return Favorite.findOne({ property: id, isDeleted: false })
    .populate("user", "fullName email profileImage")
    .populate("property");
};

const updateFavoriteById = async (favoriteId, updateBody) => {
  const favorite = await getFavoriteById(favoriteId);
  if (!favorite) {
    throw new ApiError(httpStatus.NOT_FOUND, "Favorite not found");
  }

  Object.assign(favorite, updateBody);
  await favorite.save();
  return favorite;
};

const deleteFavoriteByProperty = async (propertyId) => {
  const favorite = await getFavoriteByProperty(propertyId);
  if (!favorite) {
    throw new ApiError(httpStatus.NOT_FOUND, "Favorite not found");
  }

  favorite.isDeleted = true;
  await favorite.save();
  return favorite;
};

const deleteFavoriteById = async (favoriteId) => {
  const favorite = await getFavoriteById(favoriteId);
  if (!favorite) {
    throw new ApiError(httpStatus.NOT_FOUND, "Favorite not found");
  }

  favorite.isDeleted = true;
  await favorite.save();
  return favorite;
};

module.exports = {
  createFavorite,
  queryFavorites,
  getFavoriteById,
  updateFavoriteById,
  deleteFavoriteById,
  getFavoriteByProperty,
  deleteFavoriteByProperty,
};
