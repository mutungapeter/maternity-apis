import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";

import { redis } from "../utils/redis";
import mongoose from "mongoose";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import { newPayment } from "../services/paymentService";
import patientModel from "../models/PatientModel";
import paymentModel, { IPayment } from "../models/PaymentModel";
import appointmentModel, { IAppointment } from "../models/AppointmentModel";
import doctorModel, { IDoctor } from "../models/DoctorModel";
import {
  getAllAppointmentsService,
  newAppointment,
} from "../services/appointmentService";

export const createAppointment = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body; 
      

      const patientExist = await patientModel.findById(data.patient);
      const doctorExist = await doctorModel.findById(data.doctor);
      if (!patientExist) {
        return next(new ErrorHandler("Patient not found", 500));
      }
      if (!doctorExist) {
        return next(new ErrorHandler("Doctor not found", 500));
      }

      // const data: any = {
      //   patient:data.patient,
      //   doctor:data.patient,
      // };
      // Create the appointment
      const appointment = await appointmentModel.create({
        patient:data.patient,
        doctor:data.doctor,
      });

      doctorExist.appointments.push( appointment._id as mongoose.Types.ObjectId);
      await doctorExist.save();
      res.status(201).json({
        success: true,
        appointment,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//get all appointments --admin
export const getAllAppointments = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllAppointmentsService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get appointments for doctor
export const getDoctorAppointments = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
        
      const {id }= req.params;
   console.log(id)

      // Validate the doctor ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid Doctor ID", 400));
      }

      // Convert the doctorId to ObjectId
      const doctorId = new mongoose.Types.ObjectId(id)
      const appointments = await appointmentModel.find({ doctor: doctorId }).sort({ createdAt: -1 }).populate("patient", "name age address").populate("doctor", "name");
       // Check if appointments were found
       if (!appointments || appointments.length === 0) {
        return next(new ErrorHandler("No appointments found for this doctor", 404));
      }
      
      res.status(200).json({
        success: true,
        appointments,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);


