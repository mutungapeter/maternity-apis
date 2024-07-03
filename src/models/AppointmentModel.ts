import mongoose, { Document, Schema, Model } from "mongoose";
import { IPatient, patientSchema } from "./PatientModel";
import { IDoctor, doctorSchema } from "./DoctorModel";

export interface IAppointment extends Document {

  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
}

const appointmentSchema: Schema<IAppointment> = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
  },
  { timestamps: true }
);

const appointmentModel: Model<IAppointment> = mongoose.model(
  "Appointment",
  appointmentSchema
);

export default appointmentModel;
