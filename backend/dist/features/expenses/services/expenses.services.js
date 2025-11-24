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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
class ExpenseService {
}
_a = ExpenseService;
ExpenseService.createExpense = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, category, date, note, userId } = data;
    return yield prisma.expense.create({
        data: {
            amount: parseFloat(amount),
            category,
            date: date ? new Date(date) : new Date(),
            note,
            userId,
        },
    });
});
ExpenseService.getExpenses = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10, category, startDate, endDate, userId } = data;
    const skip = (Number(page) - 1) * Number(limit);
    const where = { userId };
    if (category)
        where.category = category;
    if (startDate || endDate) {
        where.date = {};
        if (startDate)
            where.date.gte = new Date(startDate);
        if (endDate)
            where.date.lte = new Date(endDate);
    }
    const [expenses, total] = yield Promise.all([
        prisma.expense.findMany({
            where,
            orderBy: { date: "desc" },
            skip,
            take: Number(limit),
        }),
        prisma.expense.count({ where }),
    ]);
    return {
        expenses,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit)),
        },
    };
});
ExpenseService.summary = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.expense.groupBy({
        by: ["category"],
        where: { userId },
        _sum: { amount: true },
    });
    return result.reduce((acc, curr) => {
        acc[curr.category] = curr._sum.amount || 0;
        return acc;
    }, {});
});
ExpenseService.findExpenseById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.expense.findUnique({ where: { id } });
});
ExpenseService.update = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, category, date, note } = data;
    return yield prisma.expense.update({
        where: { id },
        data: {
            amount: amount ? parseFloat(amount) : undefined,
            category,
            date: date ? new Date(date) : undefined,
            note,
        },
    });
});
ExpenseService.delete = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.expense.delete({ where: { id } });
});
exports.default = ExpenseService;
