import express from "express";
import { ExpensesController } from "../controllers/expenses.controller";
import { authMiddleware } from "../../../middlewares/authMiddleware";

const expenseRoute = express.Router();

expenseRoute.use(authMiddleware);

expenseRoute.post("/", ExpensesController.createExpenses);

expenseRoute.get("/", ExpensesController.getExpenses);

expenseRoute.get("/summary", ExpensesController.expensesSummary);

expenseRoute.put("/:id", ExpensesController.updateExpenses);

expenseRoute.delete("/:id", ExpensesController.deleteExpense);

export default expenseRoute;
