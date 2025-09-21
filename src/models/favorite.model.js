const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const favoriteSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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


favoriteSchema.plugin(toJSON);
favoriteSchema.plugin(paginate);

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;
