"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("../feature/authentication/routes/auth.routes"));
const expense_routes_1 = __importDefault(require("./expenses/expense.routes"));
const appRouter = express_1.default.Router();
appRouter.use("/auth", auth_routes_1.default);
appRouter.use("/expense", expense_routes_1.default);
exports.default = appRouter;
