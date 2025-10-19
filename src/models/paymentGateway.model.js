const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const paymentGateway = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
        required: true,
    },
    address: {
        type: String,
        required: true,
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

// Apply the plugins to the Transaction schema
paymentGateway.plugin(toJSON);
paymentGateway.plugin(paginate);

module.exports = mongoose.model("PaymentGateway", paymentGateway);
