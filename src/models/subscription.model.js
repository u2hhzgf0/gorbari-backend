const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { toJSON, paginate } = require("./plugins");
const { roles } = require("../config/roles");

const subscriptionSchema = mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: null,
    },
    subTitle: {
        type: String,
        require: false,
        default: null
    },
    description: {
      type: String,
      required: false,
      default: null,
    },
    features: {
      type: [String],
      required: false,
      default: [],
    },
    type: {
      type: String,
      required: true,
      enum: ["monthly", "yearly", "weekly"],
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    days: {
      type: Number,
      required: true,
      min: [0, "Day must be a positive."],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

subscriptionSchema.plugin(toJSON);
subscriptionSchema.plugin(paginate);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
