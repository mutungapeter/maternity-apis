

import { NextFunction, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import appointmentModel from "../models/AppointmentModel";




// create new order
export const newAppointment = CatchAsyncError(async(data:any,res:Response) => {
    const appointment = await appointmentModel.create(data);
    res.status(201).json({
        success:true,
        appointment,
    })
});

// Get All Courses
export const getAllAppointmentsService = async (res: Response) => {
    const appointments = await appointmentModel.find().sort({ createdAt: -1 }).populate("patient", "name age address").populate("doctor", "name");
    const appointmentCount = await appointmentModel.countDocuments();
    res.status(201).json({
      success: true,
      appointments,
      appointmentCount
    });
  };
  