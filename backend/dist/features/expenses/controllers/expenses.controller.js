"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpensesController = void 0;
const expenses_services_1 = __importDefault(require("../services/expenses.services"));
const response_util_1 = __importDefault(require("../../../utils/helpers/response.util"));
class ExpensesController {
    static createExpenses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Creating Expense!");
                const { amount, category, date, note } = req.body;
                if (!amount || !category) {
                    new response_util_1.default(400, false, "Amount and category are required", res);
                    return;
                }
                const data = {
                    amount,
                    category,
                    date,
                    note,
                    userId: req.user.userId,
                };
                const expense = yield expenses_services_1.default.createExpense(data);
                console.log("Created Expense!");
                new response_util_1.default(201, true, "Created successfully!", res, expense);
                return;
            }
            catch (err) {
                new response_util_1.default(500, false, err.message, res);
                return;
            }
        });
    }
    static getExpenses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.userId;
                const query = req.query;
                const data = Object.assign({ userId }, query);
                const expenses = yield expenses_services_1.default.getExpenses(data);
                new response_util_1.default(201, true, "Sucessful!", res, expenses);
                return;
            }
            catch (err) {
                new response_util_1.default(500, false, err.message, res);
                return;
            }
        });
    }
    static expensesSummary(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.userId;
                const summary = yield expenses_services_1.default.summary(userId);
                new response_util_1.default(201, true, "Sucessful!", res, summary);
                return;
            }
            catch (err) {
                new response_util_1.default(500, false, err.message, res);
                return;
            }
        });
    }
    static updateExpenses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.user.userId;
                const { amount, category, date, note } = req.body;
                const expense = yield expenses_services_1.default.findExpenseById(id);
                if (!expense || expense.userId !== userId) {
                    new response_util_1.default(404, false, "Expense not found", res);
                    return;
                }
                const data = { amount, category, date, note, userId };
                const updatedExpense = yield expenses_services_1.default.update(id, data);
                new response_util_1.default(201, true, "Expense Updated Successfully!", res, updatedExpense);
                return;
            }
            catch (err) {
                new response_util_1.default(500, false, err.message, res);
                return;
            }
        });
    }
    static deleteExpense(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = req.user.userId;
                const expense = yield expenses_services_1.default.findExpenseById(id);
                if (!expense || expense.userId !== userId) {
                    new response_util_1.default(404, false, "Expense not found", res);
                    return;
                }
                yield expenses_services_1.default.delete(id);
                new response_util_1.default(201, true, "Expense deleted Successfully!", res);
                return;
            }
            catch (err) {
                new response_util_1.default(500, false, err.message, res);
                return;
            }
        });
    }
}
exports.ExpensesController = ExpensesController;
