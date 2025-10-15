const httpStatus = require("http-status");
const { Transaction } = require("../models");
const ApiError = require("../utils/ApiError");
const mongoose = require("mongoose");

const createTransaction = async (transactionBody) => {
  const transaction = await Transaction.create(transactionBody);
  return transaction;
};

const getTransactionById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Transaction ID");
  }

  const transaction = await Transaction.findOne({ _id: id, isDeleted: false });

  if (!transaction) {
    throw new ApiError(httpStatus.NOT_FOUND, "Transaction not found");
  }

  return transaction;
};

const updateTransactionById = async (transactionId, updateBody) => {
  if (!mongoose.Types.ObjectId.isValid(transactionId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Transaction ID");
  }

  const transaction = await Transaction.findById(transactionId);

  if (!transaction || transaction.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Transaction not found");
  }

  Object.assign(transaction, updateBody);
  await transaction.save();
  return transaction;
};

const deleteTransactionById = async (transactionId) => {
  if (!mongoose.Types.ObjectId.isValid(transactionId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Transaction ID");
  }

  const transaction = await Transaction.findById(transactionId);

  if (!transaction || transaction.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Transaction not found");
  }

  transaction.isDeleted = true;
  await transaction.save();
  return transaction;
};

const queryTransactions = async (filter, options) => {
  const query = { isDeleted: false };

  for (const key of Object.keys(filter)) {
    if (filter[key] !== "") {
      query[key] = filter[key];
    }
  }

  const transactions = await Transaction.paginate(query, options);
  return transactions;
};

module.exports = {
  createTransaction,
  getTransactionById,
  updateTransactionById,
  deleteTransactionById,
  queryTransactions,
};