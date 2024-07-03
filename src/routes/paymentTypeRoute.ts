import express from "express";
import { authorizedRoles, isAuthenticated } from "../middleware/auth";
import { createPaymentType, deletePaymentType, editPaymentType, getAllPaymentTypes } from "../controllers/PaymentTypeController";
const paymentTypeRouter = express.Router();

paymentTypeRouter.post(
  "/create-payment-type",
  // isAuthenticated,
//   authorizedRoles("doctor"),
createPaymentType
);
paymentTypeRouter.get(
  "/get-payment-types",
  // isAuthenticated,
//   authorizedRoles("doctor"),
getAllPaymentTypes
);
paymentTypeRouter.put(
  "/edit-payment-type/:id",
  // isAuthenticated,
//   authorizedRoles("doctor"),
editPaymentType
);
paymentTypeRouter.delete(
  "/delete-payment-type/:id",
  // isAuthenticated,
//   authorizedRoles("doctor"),
deletePaymentType
);


export default paymentTypeRouter;