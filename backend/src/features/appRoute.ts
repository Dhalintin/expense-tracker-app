import express from "express";
import authRoute from "./authentication/routes/auth.route";
import expenseRoute from "./expenses/routes/expense.routes";

const appRouter = express.Router();

appRouter.use("/auth", authRoute);

appRouter.use("/expense", expenseRoute);

export default appRouter;
