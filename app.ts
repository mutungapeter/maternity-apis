import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./src/middleware/error";
import userRouter from "./src/routes/userRoute";
import doctorRouter from "./src/routes/doctorRoute";
import patientRouter from "./src/routes/patientRoute";
import paymentRouter from "./src/routes/paymentRoute";
import progressRouter from "./src/routes/progressRoute";
import appointmentRouter from "./src/routes/appointmentRoute";
import paymentTypeRouter from "./src/routes/paymentTypeRoute";
import { rateLimit } from "express-rate-limit";


require("dotenv").config();

//body parser
app.use(express.json({ limit: "50mb" }));

//cookie parser
app.use(cookieParser());

// cors => cross origin resource sharing
app.use(
  cors({
    origin: ["https://maternity-management-system.vercel.app", "http://localhost:3000"],
    credentials: true,
  })
);

// // api requests limit
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
//   standardHeaders: "draft-7", // Return rate limit info in the `RateLimit-*` headers
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// });


// app.use(cors());
//testing api
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "API is up and working",
  });
});
//routes
app.use(
  "/api/v1",
  userRouter,
  doctorRouter,
  patientRouter,
  paymentRouter,
  progressRouter,
  appointmentRouter,
  paymentTypeRouter
);

//unknown routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});


// app.use(limiter);
app.use(ErrorMiddleware);
