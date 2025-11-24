"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const expenses_controller_1 = require("../controllers/expenses.controller");
const authMiddleware_1 = require("../../../middlewares/authMiddleware");
const expenseRoute = express_1.default.Router();
expenseRoute.use(authMiddleware_1.authMiddleware);
expenseRoute.post("/", expenses_controller_1.ExpensesController.createExpenses);
expenseRoute.get("/", expenses_controller_1.ExpensesController.getExpenses);
expenseRoute.get("/summary", expenses_controller_1.ExpensesController.expensesSummary);
expenseRoute.put("/:id", expenses_controller_1.ExpensesController.updateExpenses);
expenseRoute.delete("/:id", expenses_controller_1.ExpensesController.deleteExpense);
exports.default = expenseRoute;
