import { NextFunction, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import paymentModel from "../models/PaymentModel";
import progressModel from "../models/ProgressModel";



// create new order
export const newProgress = CatchAsyncError(async(data:any,res:Response) => {
    const progress = await progressModel.create(data);
    res.status(201).json({
        success:true,
        progress,
    })
});
