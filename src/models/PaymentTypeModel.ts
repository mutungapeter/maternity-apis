import mongoose, { Document, Schema, Model } from "mongoose";

export interface IPaymentType extends Document {
  type: string;
  amount: number;
}

const paymentTypeSchema: Schema<IPaymentType> = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    // enum: ["registration", "checkup"],
    unique: true, 
  },
  amount: {
    type: Number,
    required: true,
  },
});

const paymentTypeModel: Model<IPaymentType> = mongoose.model(
  "PaymentType",
  paymentTypeSchema
);

export default paymentTypeModel;
