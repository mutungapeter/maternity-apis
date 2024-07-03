import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";

import { redis } from "../utils/redis";
import mongoose from "mongoose";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import { getAllPaymentsService, newPayment } from "../services/paymentService";
import patientModel from "../models/PatientModel";
import paymentModel, { IPayment } from "../models/PaymentModel";
import paymentTypeModel from "../models/PaymentTypeModel";

export const makePayment = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const type = "checkup";
      const patientExist = await patientModel.findById(data.patient);
      if (!patientExist) {
        return next(new ErrorHandler("Patient not found", 404));
      }

      // Fetch the checkup payment type to get the amount
      const paymentType = await paymentTypeModel.findOne({ type });
      // console.log("Payment type found:", paymentType);
      if (!paymentType) {
        return next(new ErrorHandler("Payment type not found", 404));
      }
      const payment = await paymentModel.create({
        amount: paymentType.amount.toString(),
        type: paymentType.type,
        patient: data.patient,
      });
      patientExist.payments.push(payment._id as mongoose.Types.ObjectId);
      await patientExist.save();
      // newPayment(data, res, next);

      res.status(200).json({
        success: true,
        payment,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
//get all payments --receiptionst --admin
export const getAllPayments = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllPaymentsService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
