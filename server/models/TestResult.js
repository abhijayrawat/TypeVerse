import mongoose from "mongoose";

const TestResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  wpm: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  time: { type: Number, required: true }, // seconds
  date: { type: Date, default: Date.now },
});

const TestResult = mongoose.model("TestResult", TestResultSchema);

export default TestResult;