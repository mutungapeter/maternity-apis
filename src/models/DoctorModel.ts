import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./UserModel";

import userModel from "./UserModel";


export interface IDoctor extends IUser {
  appointments: mongoose.Types.ObjectId[];
  phone: string;
}

export const doctorSchema: Schema<IDoctor> = new mongoose.Schema({
  appointments: [
    {
       type: mongoose.Schema.Types.ObjectId,
       ref: "Appointment",
   },
 ],
 phone: {
  type: String,
  // required: [true, "Please enter the phone number"],
},
});

const doctorModel: Model<IDoctor> = userModel.discriminator<IDoctor>("Doctor", doctorSchema);

export default doctorModel;
