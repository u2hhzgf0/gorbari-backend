const httpStatus = require("http-status");
const pick = require("../utils/pick");
const response = require("../config/response");
const { propertyService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const unlinkImages = require("../common/unlinkImage");

const createProperty = catchAsync(async (req, res) => {
  req.body.createdBy = req.user.id;

  if (req.files && req.files.images) {
    req.body.images = req.files.images.map(
      (file) => "/uploads/propertys/" + file.filename
    );
  } else if (req.body.images) {
    req.body.images = Array.isArray(req.body.images)
      ? req.body.images.map((img) => "/uploads/propertys/" + img)
      : ["/uploads/propertys/" + req.body.images];
  }

  if (req.body.other && typeof req.body.other === "string") {
    req.body.other = JSON.parse(req.body.other);
  }

  if (req.body.features && typeof req.body.features === "string") {
    req.body.features = JSON.parse(req.body.features);
    req.body.isFeatures = req.body.features.length > 0;
  }

  if (req.body.amenities && typeof req.body.amenities === "string") {
    req.body.amenities = JSON.parse(req.body.amenities);
  }

  const property = await propertyService.createProperty(req.body);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Property Created",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: property,
    })
  );
});

const getProperties = catchAsync(async (req, res) => {
  const filter = pick(req.query, [
    "title",
    "type",
    "address",
    "city",
    "state",
    "country",
    "bedrooms",
    "bathrooms",
    "zipCode",
    "lotSize",
    "maxPrice",
    "minPrice",
    "minAreaSqFt",
    "maxAreaSqFt",
  ]);

  if (filter.minPrice || filter.maxPrice) {
    filter.price = {};
    if (filter.minPrice) filter.price.min = Number(filter.minPrice);
    if (filter.maxPrice) filter.price.max = Number(filter.maxPrice);
    delete filter.minPrice;
    delete filter.maxPrice;
  }

  if (filter.minAreaSqFt || filter.maxAreaSqFt) {
    filter.areaSqFt = {};
    if (filter.minAreaSqFt) filter.areaSqFt.min = Number(filter.minAreaSqFt);
    if (filter.maxAreaSqFt) filter.areaSqFt.max = Number(filter.maxAreaSqFt);
    delete filter.minAreaSqFt;
    delete filter.maxAreaSqFt;
  }
  Object.keys(filter).forEach(key => {
    if (typeof filter[key] === 'string' && filter[key].includes(',')) {
      filter[key] = filter[key].split(',').map(v => v.trim()).filter(v => v);
    }
  });

  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await propertyService.queryProperties(filter, options);
  
  res.status(httpStatus.OK).json(
    response({
      message: "All Properties",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});


const getPropertiesAdvanced = catchAsync(async (req, res) => {
  const filter = pick(req.query, [
    "title",
    "type", 
    "address",
    "city",
    "state",
    "country",
    "bedrooms",
    "bathrooms",
    "zipCode",
    "lotSize",
    "yearBuilt",
    "garage",
    "kitchen",
    "status",
    "isFeatures",

    // Range filters --->
    "maxPrice",
    "minPrice", 
    "minAreaSqFt",
    "maxAreaSqFt",
    "minLotSize",
    "maxLotSize",
    "minBedrooms",
    "maxBedrooms",
    "minBathrooms", 
    "maxBathrooms",
    "minYearBuilt",
    "maxYearBuilt"
  ]);

  const createRangeFilter = (minKey, maxKey, targetKey) => {
    if (filter[minKey] || filter[maxKey]) {
      filter[targetKey] = {};
      if (filter[minKey]) filter[targetKey].min = Number(filter[minKey]);
      if (filter[maxKey]) filter[targetKey].max = Number(filter[maxKey]);
      delete filter[minKey];
      delete filter[maxKey];
    }
  };

  createRangeFilter('minPrice', 'maxPrice', 'price');
  createRangeFilter('minAreaSqFt', 'maxAreaSqFt', 'areaSqFt');
  createRangeFilter('minLotSize', 'maxLotSize', 'lotSize');
  createRangeFilter('minBedrooms', 'maxBedrooms', 'bedrooms');
  createRangeFilter('minBathrooms', 'maxBathrooms', 'bathrooms');
  createRangeFilter('minYearBuilt', 'maxYearBuilt', 'yearBuilt');

  Object.keys(filter).forEach(key => {
    if (typeof filter[key] === 'string' && filter[key].includes(',')) {
      filter[key] = filter[key].split(',').map(v => v.trim()).filter(v => v);
    }
  });

  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await propertyService.queryProperties(filter, options);
  
  res.status(httpStatus.OK).json(
    response({
      message: "All Properties",
      status: "OK", 
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

const getPropertyById = catchAsync(async (req, res) => {
  const property = await propertyService.getPropertyById(req.params.propertyId);
  res.status(httpStatus.OK).json(
    response({
      message: "Property Found",
      status: "OK",
      statusCode: httpStatus.OK,
      data: property,
    })
  );
});

const updateProperty = catchAsync(async (req, res) => {
  if (req.files && req.files.images) {
    req.body.images = req.files.images.map(
      (file) => "/uploads/propertys/" + file.filename
    );
  } else if (req.body.images) {
    req.body.images = Array.isArray(req.body.images)
      ? req.body.images.map((img) => "/uploads/propertys/" + img)
      : ["/uploads/propertys/" + req.body.images];
  }

  if (req.body.other && typeof req.body.other === "string") {
    req.body.other = JSON.parse(req.body.other);
  }

  if (req.body.features && typeof req.body.features === "string") {
    req.body.features = JSON.parse(req.body.features);
    req.body.isFeatures = req.body.features.length > 0;
  }

  if (req.body.amenities && typeof req.body.amenities === "string") {
    req.body.amenities = JSON.parse(req.body.amenities);
  }

  const property = await propertyService.updatePropertyById(
    req.params.propertyId,
    req.body
  );
  res.status(httpStatus.OK).json(
    response({
      message: "Property Updated",
      status: "OK",
      statusCode: httpStatus.OK,
      data: property,
    })
  );
});

const uploadPropertyImage = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No image uploaded");
  }

  const imagePath = "/uploads/propertys/" + req.file.filename;
  const property = await propertyService.uploadPropertyImage(
    req.params.propertyId,
    imagePath
  );

  res.status(httpStatus.OK).json(
    response({
      message: "Image uploaded successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: property,
    })
  );
});

const deletePropertyImage = catchAsync(async (req, res) => {
  const { imagePath } = req.body;

  const property = await propertyService.deletePropertyImage(
    req.params.propertyId,
    imagePath
  );

  res.status(httpStatus.OK).json(
    response({
      message: "Image deleted successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: property,
    })
  );
});

const deleteProperty = catchAsync(async (req, res) => {
  await propertyService.deletePropertyById(req.params.propertyId);
  res.status(httpStatus.OK).json(
    response({
      message: "Property Deleted",
      status: "OK",
      statusCode: httpStatus.OK,
      data: null,
    })
  );
});

module.exports = {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  uploadPropertyImage,
  deletePropertyImage,
  deleteProperty,
};
