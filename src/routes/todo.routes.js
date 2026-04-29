import express from "express";
import {
  createTodo,
  listTodos,
  getTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
} from "../controllers/todo.controller.js";
import { validateObjectId } from "../middlewares/validateObjectId.middleware.js";

const router = express.Router();

/**
 * TODO: Define routes
 *
 * POST   /              → createTodo
 * GET    /              → listTodos
 * GET    /:id           → getTodo (use validateObjectId middleware)
 * PATCH  /:id           → updateTodo (use validateObjectId middleware)
 * PATCH  /:id/toggle    → toggleTodo (use validateObjectId middleware)
 * DELETE /:id           → deleteTodo (use validateObjectId middleware)
 */

router.route("/")
  .get(listTodos)
  .post(createTodo);

router.route("/:id")
  .get(validateObjectId, getTodo)
  .patch(validateObjectId, updateTodo)
  .delete(validateObjectId, deleteTodo);

router.patch("/:id/toggle", validateObjectId, toggleTodo);

export default router;
