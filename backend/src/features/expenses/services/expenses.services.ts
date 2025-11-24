import { ExpenseDTO } from "../dtos.ts/expense.dto";

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

export default class ExpenseService {
  static createExpense = async (data: ExpenseDTO) => {
    const { amount, category, date, note, userId } = data;

    return await prisma.expense.create({
      data: {
        amount: parseFloat(amount as any),
        category,
        date: date ? new Date(date) : new Date(),
        note,
        userId,
      },
    });
  };

  static getExpenses = async (data: any) => {
    const { page = 1, limit = 10, category, startDate, endDate, userId } = data;

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { userId };

    if (category) where.category = category;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate as string);
      if (endDate) where.date.lte = new Date(endDate as string);
    }

    const [expenses, total] = await Promise.all([
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
  };

  static summary = async (userId: string) => {
    const result = await prisma.expense.groupBy({
      by: ["category"],
      where: { userId },
      _sum: { amount: true },
    });

    return result.reduce((acc: any, curr: any) => {
      acc[curr.category] = curr._sum.amount || 0;
      return acc;
    }, {});
  };

  static findExpenseById = async (id: string) => {
    return await prisma.expense.findUnique({ where: { id } });
  };

  static update = async (id: string, data: ExpenseDTO) => {
    const { amount, category, date, note } = data;

    return await prisma.expense.update({
      where: { id },
      data: {
        amount: amount ? parseFloat(amount as any) : undefined,
        category,
        date: date ? new Date(date) : undefined,
        note,
      },
    });
  };

  static delete = async (id: string) => {
    await prisma.expense.delete({ where: { id } });
  };
}
