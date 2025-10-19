const httpStatus = require("http-status");
const { PaymentGateway } = require("../models");
const ApiError = require("../utils/ApiError");
const mongoose = require("mongoose");

const createGateway = async (gatewayData) => {
  const gateway = await PaymentGateway.create(gatewayData);
  return gateway;
};

const getGatewayById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Payment Gateway ID");
  }

  const gateway = await PaymentGateway.findOne({ _id: id, isDeleted: false });

  if (!gateway) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment Gateway not found");
  }

  return gateway;
};

const updateGatewayById = async (id, updateBody) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Payment Gateway ID");
  }

  const gateway = await PaymentGateway.findById(id);

  if (!gateway || gateway.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment Gateway not found");
  }

  Object.assign(gateway, updateBody);
  await gateway.save();
  return gateway;
};

const deleteGatewayById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Payment Gateway ID");
  }

  const gateway = await PaymentGateway.findById(id);

  if (!gateway || gateway.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment Gateway not found");
  }

  gateway.isDeleted = true;
  await gateway.save();
  return gateway;
};

const queryGateways = async (filter, options) => {
  const query = { isDeleted: false };

  for (const key of Object.keys(filter)) {
    if (filter[key] !== "") {
      query[key] = filter[key];
    }
  }

  const gateways = await PaymentGateway.paginate(query, options);
  return gateways;
};

module.exports = {
  createGateway,
  getGatewayById,
  updateGatewayById,
  deleteGatewayById,
  queryGateways,
};
