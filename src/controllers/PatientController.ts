import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";

import { redis } from "../utils/redis";
import mongoose from "mongoose";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import { createPatient, getAllPatientsService } from "../services/patientService";
import patientModel, { IPatient } from "../models/PatientModel";
import paymentTypeModel from "../models/PaymentTypeModel";
import paymentModel from "../models/PaymentModel";


export const addPatient = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data  = req.body;
      
        const patient = await patientModel.create(data);
      // Fetch the registration payment type
      const registrationPaymentType = await paymentTypeModel.findOne({
        type: "registration",
      });

      if (!registrationPaymentType) {
        return next(new Error("Registration payment type not found"));
      }

      // Create the payment for registration
      const registrationPayment = {
        amount: registrationPaymentType.amount.toString(),
        type: registrationPaymentType.type,
        patient: patient._id,
      };

      // Save the payment
      const payment = await paymentModel.create(registrationPayment);

      // Add the payment to the patient's payments array
      patient.payments.push(payment._id as  mongoose.Types.ObjectId);
      await patient.save();

      res.status(201).json({
        success: true,
        patient,
      });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }
    }
  );

 

  //edit doctor
  export const editPatient = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = req.body;
        const patientId = req.params.id;
        // Check if the patient exists
      const patientExist = await patientModel.findById(patientId);

      if (!patientExist) {
        return next(new ErrorHandler("Patient not found", 404));
      }

        const patient = await patientModel.findByIdAndUpdate(
          patientId,
          {
            $set: data,
          },
          { new: true }
        );
  
        res.status(201).json({
          success: true,
          patient,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }
    }
  )
  export const getSinglePatient = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const patientId = req.params.id;
  
        // const isCacheExist = await redis.get(patientId);
        // // console.log("hitting redis");
        // if (isCacheExist) {
        //   const patient = JSON.parse(isCacheExist);
        //   res.status(200).json({
        //     success: true,
        //     patient,
        //   });
        // } else {
          const patient = await patientModel.findById(patientId)
          .populate('progresses','comments details appointmentDate createdAt').populate({
            path: 'payments',
            select: 'amount type',
          });
          // console.log("hitting database");
  
          // await redis.set(patientId, JSON.stringify(patient), "EX", 604800); // 7days
  
          res.status(200).json({
            success: true,
            patient,
          });
        // }
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }
    }
  );

  //get all doctors --admin
export const getAllPatients= CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllPatientsService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
  