import { NextFunction, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import paymentModel from "../models/PaymentModel";
import paymentTypeModel from "../models/PaymentTypeModel";



// create new payment type
export const paymentTypeService = CatchAsyncError(async(data:any,res:Response) => {
    const paymentType = await paymentTypeModel.create(data);
    res.status(201).json({
      success: true,
      paymentType,
    });
});


export const getAllPaymentTypesService = async (res: Response) => {
    const paymentTypes = await paymentTypeModel.find().sort({ createdAt: -1 })
    res.status(201).json({
      success: true,
      paymentTypes,
    });
  };
