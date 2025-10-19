const httpStatus = require("http-status");
const { Subscription, Payment } = require("../models");
const ApiError = require("../utils/ApiError");
const mongoose = require("mongoose");
const { getUserById } = require("./user.service");
const { transactionService } = require(".");

const createSubscription = async (subscriptionBody) => {
  const subscription = await Subscription.create(subscriptionBody);
  return subscription;
};

const getSubscriptionById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Subscription ID");
  }

  const subscription = await Subscription.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!subscription) {
    throw new ApiError(httpStatus.NOT_FOUND, "Subscription not found");
  }

  return subscription;
};

const updateSubscriptionById = async (subscriptionId, updateBody) => {
  if (!mongoose.Types.ObjectId.isValid(subscriptionId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Subscription ID");
  }

  const subscription = await Subscription.findById(subscriptionId);

  if (!subscription || subscription.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Subscription not found");
  }

  Object.assign(subscription, updateBody);
  await subscription.save();
  return subscription;
};

const deleteSubscriptionById = async (subscriptionId) => {
  if (!mongoose.Types.ObjectId.isValid(subscriptionId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Subscription ID");
  }

  const subscription = await Subscription.findById(subscriptionId);

  if (!subscription || subscription.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Subscription not found");
  }

  subscription.isDeleted = true;
  await subscription.save();
  return subscription;
};

const querySubscriptions = async (filter, options) => {
  const query = { isDeleted: false };

  for (const key of Object.keys(filter)) {
    if (filter[key] !== "") {
      if (key === "title" || key === "description" || key === "type") {
        query[key] = { $regex: filter[key], $options: "i" }; // case-insensitive search
      } else {
        query[key] = filter[key];
      }
    }
  }

  const subscriptions = await Subscription.paginate(query, options);
  return subscriptions;
};

const takeSubscriptions = async (userId, subData) => {
  const user = await getUserById(userId);

  const subDatas = {
    user: user._id,
    subscriptionId: subData.subscriptionId,
    status: "pending",
    subscriptionLimitation: subData.days || 0,
    subscriptionExpirationDate: new Date() + subData.days,
    type: subData.type,
    amount: subData.amount,
    screenshot: subData.screenshot || null,
    transactionId: subData.transactionId || null,
  };

  const transaction = await transactionService.createTransaction(subDatas);

  user.subscription = {
    subscriptionId: subData.subscriptionId,
    transactionId: transaction._id,
    subscriptionExpirationDate: subDatas.subscriptionExpirationDate,
    status: "pending",
  };

  await user.save();

  return transaction;
};

const updatePayment = async (paymentData) => {
  const payment = await Payment.findOne({
    checkoutSessionId: paymentData.checkoutSessionId,
  });

  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, "The payment is not found");
  }

  payment.status = paymentData.status || payment.status;
  payment.stripeSubId = paymentData.stripeSubId || "";
  payment.mode = paymentData.mode || "";
  payment.stripeInfo = paymentData.stripeInfo || {};

  await payment.save();

  return payment;
};

const findPaymentByStripSubId = async (stripeSubId) => {
  console.log("Finding payment with Stripe Subscription ID:", stripeSubId);
  const payment = await Payment.findOne({ stripeSubId: stripeSubId });

  if (!payment) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "The payment is not found findPaymentByStripSubId"
    );
  }

  return payment;
};

module.exports = {
  createSubscription,
  getSubscriptionById,
  updateSubscriptionById,
  deleteSubscriptionById,
  querySubscriptions,

  takeSubscriptions,
  updatePayment,
  findPaymentByStripSubId,
};
