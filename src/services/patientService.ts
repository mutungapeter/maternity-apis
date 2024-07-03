import { Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import patientModel from "../models/PatientModel";


export const createPatient = CatchAsyncError(async(data:any,res:Response)=>{
    const patient = await patientModel.create(data);
    // console.log(patient)
    res.status(201).json({
        success:true,
        patient
    });
})

//get all patients
export const getAllPatientsService = async (res: Response) => {
    const patients = await patientModel.find().sort({ createdAt: -1 })
    const patientCount = await patientModel.countDocuments();
    res.status(201).json({
      success: true,
      patients,
      patientCount
    });
  };
