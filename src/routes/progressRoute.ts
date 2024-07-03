import express from "express";
import { authorizedRoles, isAuthenticated } from "../middleware/auth";
import { addProgress } from "../controllers/ProgressController";

const progressRouter = express.Router();

progressRouter.post(
  "/add-progress",
//   isAuthenticated,
//   authorizedRoles("doctor"),
  addProgress
);


export default progressRouter;