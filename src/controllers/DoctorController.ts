import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/UserModel";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from "../utils/jwt";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import {
  getAllUsersService,
  getUserById,
  updateUserRoleService,
} from "../services/userServices";
import cloudinary from "cloudinary";
import IRegistrationBody from "./userController";
import doctorModel, { IDoctor } from "../models/DoctorModel";
import { getAllDoctorsService } from "../services/doctorService";
require("dotenv").config();

// interface IDoctorRegistrationBody extends IRegistrationBody {
//   appointments?: Array<{ appointmentId: string }>;
// }

export const registerDoctor = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const email = data.email
      const isEmailExist = await userModel.findOne({email});
      if (isEmailExist) {
        return next(new ErrorHandler("Doctor with Email already exists", 400));
      }

      // const user: IDoctorRegistrationBody = {
      //   name,
      //   email,
      //   password,
      //   appointments: appointments || [],
      // };

      // const activationToken = createActivationToken(user);
      // const activationCode = activationToken.activationCode;

      // const data = { user: { name: user.name }, activationCode };
      // const html = await ejs.renderFile(
      //   path.join(__dirname, "../mails/activation-mail.ejs"),
      //   data
      // );

      // try {
      //   await sendMail({
      //     email: user.email,
      //     subject: "Activate your account",
      //     template: "activation-mail.ejs",
      //     data,
      //   });

      //   res.status(201).json({
      //     success: true,
      //     message: `Please check your email: ${user.email} to activate your account!`,
      //     activationToken: activationToken.token,
      //   });
      // } catch (error: any) {
      //   return next(new ErrorHandler(error.message, 400));
      // }
      const doctorData = {
        name:data.name,
        email:data.email,
        password:data.password,
        phone:data.phone,
        appointments:data.appointments || [],
        role: "doctor",
      };

      const doctor = await doctorModel.create(doctorData);

      res.status(201).json({
        success: true,
        message: "Doctor registered successfully!",
        doctor,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IActivationToken {
  token: string;
  activationCode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.ACTIVATION_SECRET as Secret,
    {
      expiresIn: "5m",
    }
  );

  return { token, activationCode };
};

// activate user
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

interface IActivationTokenPayload {
  user: IUser | IDoctor; // User can be either IUser or IDoctor
  activationCode: string;
}

// activate doctor
export const activateDoctor = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;

      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as IActivationTokenPayload;

      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }

      const { name, email, password } = newUser.user;
      const appointments = (newUser.user as IDoctor).appointments;

      const existUser = await userModel.findOne({ email });

      if (existUser) {
        return next(new ErrorHandler("Email already exists", 400));
      }

      const doctor = await doctorModel.create({
        name,
        email,
        password,
        appointments,
        role: "doctor",
      });

      res.status(201).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//get all doctors --admin
export const getAllDoctors= CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllDoctorsService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
export const getDoctor = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const  doctorId  = req.params.id as string;
      const isCacheExist = await redis.get(doctorId);
      // console.log("hitting redis");
      if (isCacheExist) {
        const doctor = JSON.parse(isCacheExist);
        res.status(200).json({
          success: true,
          doctor,
        });
      } else {
        const doctor = await doctorModel.findById(doctorId)
        .populate({
          path: 'appointments',
          model: 'Appointment',
          populate: [
            { path: 'patient', model: 'Patient', select: 'name age address id_number phone' },
            { path: 'doctor', model: 'Doctor', select: 'name email' }
          ]
        });
        if (!doctor) {
          return next(new ErrorHandler("Doctor not found", 404));
        }

        await redis.set(doctorId, JSON.stringify(doctor), "EX", 604800); // 7days

        res.status(200).json({
          success: true,
          doctor,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// update doctor
export const editDoctor = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const doctorId = req.params.id;
      const doctor = await doctorModel.findByIdAndUpdate(
        doctorId,
        {
          $set: data,
        },
        { new: true }
      );

      res.status(201).json({
        success: true,
        doctor,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
)