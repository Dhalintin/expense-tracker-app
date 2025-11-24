import { Request, Response } from "express";
import ExpenseService from "../services/expenses.services";
import { ExpenseDTO } from "../dtos.ts/expense.dto";
import CustomResponse from "../../../utils/helpers/response.util";

export class ExpensesController {
  static async createExpenses(req: Request, res: Response): Promise<void> {
    try {
      console.log("Creating Expense!");
      const { amount, category, date, note } = req.body;

      if (!amount || !category) {
        new CustomResponse(400, false, "Amount and category are required", res);
        return;
      }

      const data: ExpenseDTO = {
        amount,
        category,
        date,
        note,
        userId: req.user.userId,
      };

      const expense = await ExpenseService.createExpense(data);
      console.log("Created Expense!");
      new CustomResponse(201, true, "Created successfully!", res, expense);
      return;
    } catch (err: any) {
      new CustomResponse(500, false, err.message, res);
      return;
    }
  }

  static async getExpenses(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user.userId;
      const query = req.query;
      const data = { userId, ...query };
      const expenses = await ExpenseService.getExpenses(data);
      new CustomResponse(201, true, "Sucessful!", res, expenses);
      return;
    } catch (err: any) {
      new CustomResponse(500, false, err.message, res);
      return;
    }
  }

  static async expensesSummary(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user.userId;
      const summary = await ExpenseService.summary(userId);
      new CustomResponse(201, true, "Sucessful!", res, summary);
      return;
    } catch (err: any) {
      new CustomResponse(500, false, err.message, res);
      return;
    }
  }

  static async updateExpenses(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const userId = req.user.userId;

      const { amount, category, date, note } = req.body;

      const expense: any = await ExpenseService.findExpenseById(id);

      if (!expense || expense.userId !== userId) {
        new CustomResponse(404, false, "Expense not found", res);
        return;
      }

      const data: ExpenseDTO = { amount, category, date, note, userId };

      const updatedExpense = await ExpenseService.update(id, data);
      new CustomResponse(
        201,
        true,
        "Expense Updated Successfully!",
        res,
        updatedExpense
      );
      return;
    } catch (err: any) {
      new CustomResponse(500, false, err.message, res);
      return;
    }
  }

  static async deleteExpense(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const userId = req.user.userId;

      const expense: any = await ExpenseService.findExpenseById(id);

      if (!expense || expense.userId !== userId) {
        new CustomResponse(404, false, "Expense not found", res);
        return;
      }

      await ExpenseService.delete(id);
      new CustomResponse(201, true, "Expense deleted Successfully!", res);
      return;
    } catch (err: any) {
      new CustomResponse(500, false, err.message, res);
      return;
    }
  }
}
