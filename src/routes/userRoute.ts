import express from "express";
import {
  activateUser,
  getUserInfo,
  loginUser,
  logoutUser,
  registerUser,
  socialAuth,
  updateAccessToken,
  updatePassword,
  updateUserInfo,
  updateProfilePicture,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "../controllers/userController";
import { authorizedRoles, isAuthenticated } from "../middleware/auth";
const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/activate-user", activateUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", isAuthenticated, logoutUser);
userRouter.get("/refresh", updateAccessToken);
userRouter.get("/me",
   isAuthenticated,
  getUserInfo);
userRouter.post("/social-auth", socialAuth);
userRouter.put("/update-user-info", isAuthenticated, updateUserInfo);
userRouter.put("/update-user-password", isAuthenticated, updatePassword);
userRouter.put("/update-user-avatar", isAuthenticated, updateProfilePicture);
userRouter.get(
  "/get-all-users",
  isAuthenticated,
  authorizedRoles("admin"),
  getAllUsers
);
userRouter.put(
  "/update-user-role",
  isAuthenticated,
  // authorizedRoles("admin"),
  updateUserRole
);
userRouter.delete(
  "/delete-user/:id",
  isAuthenticated,
  authorizedRoles("admin"),
  deleteUser
);

export default userRouter;
