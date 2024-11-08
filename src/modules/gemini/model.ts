var mongoose = require("mongoose");

const Schema = mongoose.Schema;
const geminiSchema = new Schema(
  {
    name: { type: String },
    kakeibo: { type: String },
    transactionId: { type: String },
  },
  { timestamps: true }
);

const geminiCollection = "gemini";

export { geminiSchema, geminiCollection };
