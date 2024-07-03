import { NextFunction, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import paymentModel from "../models/PaymentModel";



// create new order
export const newPayment = CatchAsyncError(async(data:any,res:Response) => {
    const payment = await paymentModel.create(data);
    res.status(201).json({
        success:true,
        payment,
    })
});


export const getAllPaymentsService = async (res: Response) => {
    const payments = await paymentModel.find().sort({ createdAt: -1 }).populate('patient', 'name');
    const totalAmount = await paymentModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: { $toDouble: "$amount" } }
        }
      }
    ]);
    res.status(201).json({
      success: true,
      payments,
      totalAmount: totalAmount[0]?.total || 0,
    });
  };
