import mongoose, { Document, Schema, Model } from "mongoose";

export interface IPatient extends Document {
  name: string;
  age: number;
  phone: string;
  address: string;
  id_number: string;
  payments: mongoose.Types.ObjectId[];
  progresses: mongoose.Types.ObjectId[];
}

export const patientSchema: Schema<IPatient> = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the patient's name"],
  },
  age: {
    type: Number,
    required: [true, "Please enter the patient's age"],
  },
  phone: {
    type: String,
    required: [true, "Please enter the patient's phone number"],
    unique: true,
  },
  address: {
    type: String,
    required: [true, "Please enter the patient's address"],
  },
  id_number: {
    type: String,
    required: [true, "Please enter the patient's ID number"],
    unique: true,
  },

  payments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
  ],
  progresses: [
     {
  
        type: mongoose.Schema.Types.ObjectId,
        ref: "Progress",
       
        
    },
  ],
},{timestamps: true});

const patientModel: Model<IPatient> = mongoose.model("Patient", patientSchema);

export default patientModel;
