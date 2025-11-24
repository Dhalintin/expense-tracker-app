import { User } from "../dtos/auth.dto";

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

export default class AuthService {
  static getUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({ where: { email } });
  };

  static registerUser = async (data: User) => {
    return await prisma.user.create({
      data: {
        ...data,
        createdAt: new Date(),
      },
    });
  };
}
