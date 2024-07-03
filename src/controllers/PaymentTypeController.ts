import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";

import { redis } from "../utils/redis";
import mongoose from "mongoose";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import {  getAllPaymentsService, newPayment } from "../services/paymentService";
import patientModel from "../models/PatientModel";
import paymentModel, { IPayment } from "../models/PaymentModel";
import { getAllPaymentTypesService, paymentTypeService } from "../services/paymentTypeServices";
import paymentTypeModel from "../models/PaymentTypeModel";

export const createPaymentType  = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        try {
            const data  = req.body;
            // console.log(data)
            paymentTypeService(data, res, next);
          } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
          }
      } catch (error:any) {
        return next(new ErrorHandler(error.message, 500));
      }
    }
  );

export const getAllPaymentTypes= CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        getAllPaymentTypesService(res);
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }
    }
  );

   //edit payment type
   export const editPaymentType = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = req.body;
        const { id } = req.params;
    
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return next(new ErrorHandler("Invalid Payment Type", 400));
        }
  
        const paymentTypeId = new mongoose.Types.ObjectId(id);
     
  
      const paymentTypeExist = await paymentTypeModel.findById(paymentTypeId);

      if (!paymentTypeExist) {
        return next(new ErrorHandler("Payment Type not found", 404));
      }
        const paymentType = await paymentTypeModel.findByIdAndUpdate(
          paymentTypeId,
          {
            $set: data,
          },
          { new: true, runValidators: true }
        );
  
        res.status(201).json({
          success: true,
          paymentType,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }
    }
  )


  //delete payment type controller
  export const deletePaymentType = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
  
        const paymentType = await paymentTypeModel.findById(id);
  
        if (!paymentType) {
          return next(new ErrorHandler("paymentType not found", 404));
        }
  
        await paymentType.deleteOne({ id });
  
        await redis.del(id);
  
        res.status(200).json({
          success: true,
          message: "Payment Type deleted successfully",
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    }
  );