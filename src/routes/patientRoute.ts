import express from "express";
import { authorizedRoles, isAuthenticated } from "../middleware/auth";
import { addPatient, editPatient, getSinglePatient,getAllPatients } from "../controllers/PatientController";
const patientRouter = express.Router();

patientRouter.post(
  "/create-patient",
  isAuthenticated,
  // authorizedRoles("receptionist"),
  addPatient
);
patientRouter.get(
  "/get-patient/:id",
  // isAuthenticated,
  // authorizedRoles("doctor"),
  getSinglePatient
);
patientRouter.put(
  "/edit-patient/:id",
  // isAuthenticated,
  // authorizedRoles("doctor"),
  editPatient
);
patientRouter.get(
  "/get-all-patients",
  // isAuthenticated,
  // authorizedRoles("doctor"),
  getAllPatients
);



export default patientRouter;