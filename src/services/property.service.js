const httpStatus = require("http-status");
const { Property } = require("../models");
const ApiError = require("../utils/ApiError");
const { default: mongoose } = require("mongoose");

const createProperty = async (propertyBody) => {
  return Property.create(propertyBody);
};

const queryProperties = async (filter, options) => {
  const matchStage = { isDeleted: false };

  Object.keys(filter).forEach((key) => {
    const value = filter[key];
    if (!value || value === "") return;

    if (
      [
        "title",
        "type",
        "address",
        "city",
        "state",
        "country",
        "zipCode",
        "status",
        "catagory",
      ].includes(key)
    ) {
      if (Array.isArray(value)) {
        matchStage[key] = {
          $in: value.map((v) => new RegExp(v, "i")),
        };
      } else if (typeof value === "string" && value.includes(",")) {
        // Split comma-separated values
        const values = value
          .split(",")
          .map((v) => v.trim())
          .filter((v) => v);
        matchStage[key] = {
          $in: values.map((v) => new RegExp(v, "i")),
        };
      } else {
        matchStage[key] = { $regex: value, $options: "i" };
      }
    } else if (
      typeof value === "object" &&
      (value.min !== undefined || value.max !== undefined)
    ) {
      matchStage[key] = {};
      if (value.min !== undefined) matchStage[key].$gte = Number(value.min);
      if (value.max !== undefined) matchStage[key].$lte = Number(value.max);
    } else if (Array.isArray(value)) {
      matchStage[key] = { $in: value.map((v) => (isNaN(v) ? v : Number(v))) };
    } else if (typeof value === "string" && value.includes(",")) {
      const values = value
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v);
      matchStage[key] = { $in: values.map((v) => (isNaN(v) ? v : Number(v))) };
    } else {
      matchStage[key] = isNaN(value) ? value : Number(value);
    }
  });

  const pipeline = [{ $match: matchStage }];

  // Add sorting
  if (options.sortBy) {
    const sortFields = options.sortBy.split(",");
    const sortStage = {};

    sortFields.forEach((field) => {
      if (field.startsWith("-")) {
        sortStage[field.substring(1)] = -1;
      } else {
        sortStage[field] = 1;
      }
    });

    pipeline.push({ $sort: sortStage });
  } else {
    pipeline.push({ $sort: { createdAt: -1 } });
  }
  const page = parseInt(options.page) || 1;
  const limit = parseInt(options.limit) || 10;
  const skip = (page - 1) * limit;

  pipeline.push({
    $facet: {
      results: [{ $skip: skip }, { $limit: limit }],
      totalCount: [{ $count: "count" }],
    },
  });

  const [result] = await Property.aggregate(pipeline);
  const totalResults = result.totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalResults / limit);

  return {
    results: result.results,
    page,
    limit,
    totalPages,
    totalResults,
  };
};

const queryPropertiesForAgent = async (filter, options, userId) => {
  const matchStage = {
    createdBy: new mongoose.Types.ObjectId(userId),
    isDeleted: false,
  };

  Object.keys(filter).forEach((key) => {
    const value = filter[key];
    if (!value || value === "") return;

    if (
      [
        "title",
        "type",
        "address",
        "city",
        "state",
        "country",
        "zipCode",
        "status",
        "catagory",
      ].includes(key)
    ) {
      if (Array.isArray(value)) {
        matchStage[key] = {
          $in: value.map((v) => new RegExp(v, "i")),
        };
      } else if (typeof value === "string" && value.includes(",")) {
        // Split comma-separated values
        const values = value
          .split(",")
          .map((v) => v.trim())
          .filter((v) => v);
        matchStage[key] = {
          $in: values.map((v) => new RegExp(v, "i")),
        };
      } else {
        matchStage[key] = { $regex: value, $options: "i" };
      }
    } else if (
      typeof value === "object" &&
      (value.min !== undefined || value.max !== undefined)
    ) {
      matchStage[key] = {};
      if (value.min !== undefined) matchStage[key].$gte = Number(value.min);
      if (value.max !== undefined) matchStage[key].$lte = Number(value.max);
    } else if (Array.isArray(value)) {
      matchStage[key] = { $in: value.map((v) => (isNaN(v) ? v : Number(v))) };
    } else if (typeof value === "string" && value.includes(",")) {
      const values = value
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v);
      matchStage[key] = { $in: values.map((v) => (isNaN(v) ? v : Number(v))) };
    } else {
      matchStage[key] = isNaN(value) ? value : Number(value);
    }
  });

  const pipeline = [{ $match: matchStage }];

  // Add sorting
  if (options.sortBy) {
    const sortFields = options.sortBy.split(",");
    const sortStage = {};

    sortFields.forEach((field) => {
      if (field.startsWith("-")) {
        sortStage[field.substring(1)] = -1;
      } else {
        sortStage[field] = 1;
      }
    });

    pipeline.push({ $sort: sortStage });
  } else {
    pipeline.push({ $sort: { createdAt: -1 } });
  }
  const page = parseInt(options.page) || 1;
  const limit = parseInt(options.limit) || 10;
  const skip = (page - 1) * limit;

  pipeline.push({
    $facet: {
      results: [{ $skip: skip }, { $limit: limit }],
      totalCount: [{ $count: "count" }],
    },
  });

  const [result] = await Property.aggregate(pipeline);
  const totalResults = result.totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalResults / limit);

  return {
    results: result.results,
    page,
    limit,
    totalPages,
    totalResults,
  };
};

const getPropertyById = async (id) => {
  return Property.findOne({ _id: id, isDeleted: false }).populate(
    "createdBy",
    "fullName profileImage"
  );
};

const updatePropertyById = async (propertyId, updateBody) => {
  const property = await getPropertyById(propertyId);
  if (!property) {
    throw new ApiError(httpStatus.NOT_FOUND, "Property not found");
  }

  Object.assign(property, updateBody);
  await property.save();
  return property;
};

const uploadPropertyImage = async (propertyId, imagePath) => {
  const property = await Property.findById(propertyId);
  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  property.images.push(imagePath);
  await property.save();
  return property;
};

const deletePropertyImage = async (propertyId, imagePath) => {
  const property = await Property.findById(propertyId);
  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  property.images = property.images.filter((img) => img !== imagePath);
  await property.save();
  return property;
};

const deletePropertyById = async (propertyId) => {
  const property = await getPropertyById(propertyId);
  if (!property) {
    throw new ApiError(httpStatus.NOT_FOUND, "Property not found");
  }

  property.isDeleted = true;
  await property.save();
  return property;
};

const bostProperty = async (propertyId, bostData) => {
  const property = await getPropertyById(propertyId);
  if (!property) {
    throw new ApiError(httpStatus.NOT_FOUND, "Property not found");
  }

  property.isBosted = bostData.isBosted;
  property.bostedRank = bostData.bostedRank;
  property.bosteExpiry = bostData.bosteExpiry;

  await property.save();
  return property;
};

module.exports = {
  createProperty,
  queryProperties,
  getPropertyById,
  updatePropertyById,
  uploadPropertyImage,
  deletePropertyImage,
  deletePropertyById,
  queryPropertiesForAgent,

  bostProperty,
};
