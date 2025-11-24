import { Request, Response } from "express";

import AuthService from "../services/auth.service";

import { comparePassword, hashPassword } from "../../../utils/hash";
import { User } from "../dtos/auth.dto";
import { tokenService } from "../../../utils/jwt";
import CustomResponse from "../../../utils/helpers/response.util";

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      console.log("Registering!");
      const { name, email, password } = req.body;

      if (!email || !password || !name) {
        new CustomResponse(400, false, "All fields are required", res);
        return;
      }

      const existingUser = await AuthService.getUserByEmail(email);

      if (existingUser) {
        new CustomResponse(400, false, "User already exists", res);
        return;
      }

      const hashedPassword = await hashPassword(password);

      const data: User = {
        name,
        email,
        password: hashedPassword,
      };

      console.log("Stored");

      const user = await AuthService.registerUser(data);

      const token = tokenService.generateToken(user.id);

      const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        token,
      };

      new CustomResponse(
        400,
        true,
        "User registered successfully",
        res,
        userResponse
      );
      return;
    } catch (err: any) {
      console.log(err);
      new CustomResponse(500, false, err.message, res);
      return;
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      console.log("Logging in!");
      const { email, password } = req.body;

      if (!email || !password) {
        new CustomResponse(401, false, "Email or Password incorrect!", res);
        return;
      }

      const existingUser = await AuthService.getUserByEmail(email);

      if (!existingUser) {
        new CustomResponse(401, false, "Email or Password incorrect!", res);
        return;
      }

      const passwordMatch = await comparePassword(
        password,
        existingUser.password
      );

      if (!passwordMatch) {
        new CustomResponse(401, false, "Email or Password incorrect!", res);
        return;
      }

      const token = tokenService.generateToken(existingUser.id);

      const userResponse = {
        token,
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
      };

      new CustomResponse(
        201,
        true,
        "User registered successfully",
        res,
        userResponse
      );
      return;
    } catch (err: any) {
      new CustomResponse(500, false, err.message, res);
      return;
    }
  }
}
