import { Router } from "express";

import {
  deleteOwnAccountController,
  deleteUserController,
  listUsersController,
  showOwnProfile,
  showUserController,
  updateOwnProfileController,
  updateUserController,
} from "../controllers/userController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const userRoutes = Router();

// Todas as rotas deste arquivo exigem autenticação.
userRoutes.use(authMiddleware);

// Rotas do próprio usuário.
// Elas precisam ficar antes da rota "/:id".
userRoutes.get("/me", showOwnProfile);
userRoutes.patch("/me", updateOwnProfileController);
userRoutes.delete("/me", deleteOwnAccountController);

// Rotas administrativas.
userRoutes.get(
  "/",
  roleMiddleware("ADMIN"),
  listUsersController
);

userRoutes.get(
  "/:id",
  roleMiddleware("ADMIN"),
  showUserController
);

userRoutes.patch(
  "/:id",
  roleMiddleware("ADMIN"),
  updateUserController
);

userRoutes.delete(
  "/:id",
  roleMiddleware("ADMIN"),
  deleteUserController
);

export { userRoutes };