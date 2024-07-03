import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";

import { redis } from "../utils/redis";
import mongoose from "mongoose";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import progressModel, { IProgress } from "../models/ProgressModel";
import patientModel from "../models/PatientModel";
import { newProgress } from "../services/progressService";

export const addProgress = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { details, comments, patient, appointmentDate } = req.body as IProgress;
        const patientExist = await patientModel.findById(patient);
        if (!patientExist) {
            return next(new ErrorHandler("Patient not found", 404));
          }
          const data: any = {
            patient,
            comments,
            details,
            appointmentDate
          };
    
        const progress = await progressModel.create({
            patient,
            details,
            comments,
            appointmentDate
            
          });
          patientExist.progresses.push(progress._id as mongoose.Types.ObjectId);
          await patientExist.save();
          // newProgress(data, res, next);
          res.status(201).json({
            success:true,
            progress,
        })
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }
    }
  );