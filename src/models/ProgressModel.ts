import mongoose, { Document, Schema, Model } from "mongoose";

export interface IProgress extends Document {
  details: string;
  comments: string;
  patient: mongoose.Types.ObjectId;
  appointmentDate: Date;
}
const progressSchema: Schema<IProgress> = new mongoose.Schema({
  details: {
    type: String,
  },
  comments: {
    type: String,
  },
  appointmentDate: {
    type: Date,
  },
  patient:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  }
},{timestamps: true});

const progressModel: Model<IProgress> = mongoose.model(
  "Progress",
  progressSchema
);

export default progressModel;
