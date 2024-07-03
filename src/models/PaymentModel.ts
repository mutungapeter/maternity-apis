import mongoose, { Document, Schema, Model } from "mongoose";

export interface IPayment extends Document {
  amount: string;
  type: string;
  patient: mongoose.Types.ObjectId;
}

const paymentSchema: Schema<IPayment> = new mongoose.Schema(
  {
    amount: {
      type: String,
      required: [true, "Please enter the patient's name"],
    },
    type: {
      type: String,
      required: [true, "Please enter the type"],
      enum: ["registration", "checkup"],
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
  },
  { timestamps: true }
);

const paymentModel: Model<IPayment> = mongoose.model("Payment", paymentSchema);

export default paymentModel;
