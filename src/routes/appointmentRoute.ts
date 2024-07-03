

import express from "express";
import { authorizedRoles, isAuthenticated } from "../middleware/auth";
import { createAppointment, getAllAppointments, getDoctorAppointments } from "../controllers/AppointmentController";
const appointmentRouter = express.Router();

appointmentRouter.post(
  "/create-appointment",
//   isAuthenticated,
//   authorizedRoles("doctor"),
createAppointment
);
appointmentRouter.get(
  "/get-all-appointments",
//   isAuthenticated,
//   authorizedRoles("doctor"),
getAllAppointments
);
appointmentRouter.get(
  "/get-all-doctor-appointments/:id",
  // isAuthenticated,
  // authorizedRoles("doctor"),
getDoctorAppointments
);


export default appointmentRouter;