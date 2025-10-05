const mongoose = require("mongoose");
const validator = require("validator");
const { toJSON, paginate } = require("./plugins");

const contactSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.type === "property";
      },
    },
    property: {
      type: mongoose.Types.ObjectId,
      ref: "Property",
      required: function () {
        return this.type === "property";
      },
    },
    propertyWoner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.type === "property";
      },
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
    },
    fullName: {
      type: String,
      trim: true,
      required: function () {
        return this.type === "general";
      },
    },
    email: {
      type: String,
      lowercase: true,
      required: function () {
        return this.type === "general";
      },
      validate(value) {
        if (value && !validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    phoneNumber: {
      type: String,
    },
    address: {
      type: String,
    },
    message: {
      type: String,
      required: function () {
        return this.type === "general"; 
      },
    },
    type: {
      type: String,
      enum: ["general", "property"],
      required: true,
      default: "general",
    },
  },
  {
    timestamps: true,
  }
);

contactSchema.plugin(toJSON);
contactSchema.plugin(paginate);

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
