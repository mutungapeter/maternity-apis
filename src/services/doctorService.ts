

import { NextFunction, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import appointmentModel from "../models/AppointmentModel";
import doctorModel from "../models/DoctorModel";

// Get All Courses
export const getAllDoctorsService = async (res: Response) => {
    const doctors = await doctorModel.find().sort({ createdAt: -1 })
    const doctorCount = await doctorModel.countDocuments();
    res.status(201).json({
      success: true,
      doctors,
      doctorCount
    });
  };