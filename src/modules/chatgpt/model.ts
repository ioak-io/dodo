var mongoose = require("mongoose");

const Schema = mongoose.Schema;
const chatgptSchema = new Schema(
  {
    name: { type: String },
    kakeibo: { type: String },
    transactionId: { type: String },
  },
  { timestamps: true }
);

const chatgptCollection = "chatgpt";

// module.exports = mongoose.model('bookmarks', articleSchema);
export { chatgptSchema, chatgptCollection };
