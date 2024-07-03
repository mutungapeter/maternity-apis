import express from "express";
import { authorizedRoles, isAuthenticated } from "../middleware/auth";
import { getAllPayments, makePayment } from "../controllers/PaymentController";
const paymentRouter = express.Router();

paymentRouter.post(
  "/make-payment",
  // isAuthenticated,
//   authorizedRoles("doctor"),
  makePayment
);
paymentRouter.get(
  "/get-all-payments",
  // isAuthenticated,
//   authorizedRoles("doctor"),
getAllPayments
);


export default paymentRouter;