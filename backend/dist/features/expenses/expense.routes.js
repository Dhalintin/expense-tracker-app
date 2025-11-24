"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_Middleware_1 = require("../../middlewares/auth.Middleware");
const expenses_controller_1 = require("./controllers/expenses.controller");
const expenseRoute = express_1.default.Router();
expenseRoute.use(auth_Middleware_1.authMiddleware);
expenseRoute.post("/expenses", expenses_controller_1.ExpensesController.createExpenses);
expenseRoute.get("/expenses", expenses_controller_1.ExpensesController.getExpenses);
expenseRoute.get("/expenses/summary", expenses_controller_1.ExpensesController.expensesSummary);
expenseRoute.put("/expenses/:id", expenses_controller_1.ExpensesController.updateExpenses);
expenseRoute.delete("/expenses/:id", expenses_controller_1.ExpensesController.deleteExpense);
exports.default = expenseRoute;
