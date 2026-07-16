import { Router } from "express";

import {
  createTagController,
  deleteTagController,
  getTagController,
  listTagsController,
  updateTagController,
} from "../controllers/tagController.js";

import {
  authMiddleware,
} from "../middlewares/authMiddleware.js";

const tagRoutes = Router();

/*
 * Todas as rotas de tags exigem
 * que o usuário esteja autenticado.
 */
tagRoutes.use(authMiddleware);

/*
 * GET /api/tags
 *
 * Exemplos:
 *
 * /api/tags
 * /api/tags?scope=INCOME
 * /api/tags?scope=EXPENSE
 * /api/tags?isActive=false
 * /api/tags?search=saude
 */
tagRoutes.get(
  "/",
  listTagsController
);

/*
 * GET /api/tags/:id
 */
tagRoutes.get(
  "/:id",
  getTagController
);

/*
 * POST /api/tags
 */
tagRoutes.post(
  "/",
  createTagController
);

/*
 * PATCH /api/tags/:id
 */
tagRoutes.patch(
  "/:id",
  updateTagController
);

/*
 * DELETE /api/tags/:id
 */
tagRoutes.delete(
  "/:id",
  deleteTagController
);

export { tagRoutes };