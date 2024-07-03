import express from "express";
import { authorizedRoles, isAuthenticated } from "../middleware/auth";
import { activateDoctor, editDoctor, getAllDoctors, getDoctor, registerDoctor } from "../controllers/DoctorController";

const doctorRouter = express.Router();

doctorRouter.post("/register-doctor", isAuthenticated,authorizedRoles("admin"), registerDoctor);

doctorRouter.post("/activate-doctor", activateDoctor);
doctorRouter.get("/get-all-doctors", getAllDoctors);
doctorRouter.get("/get-doctor/:id", getDoctor );
doctorRouter.put("/edit-doctor/:id", editDoctor );

export default doctorRouter;