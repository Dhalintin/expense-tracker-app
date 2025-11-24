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
exports.AuthController = void 0;
const auth_service_1 = __importDefault(require("../services/auth.service"));
const hash_1 = require("../../../utils/hash");
const jwt_1 = require("../../../utils/jwt");
const response_util_1 = __importDefault(require("../../../utils/helpers/response.util"));
class AuthController {
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Registering!");
                const { name, email, password } = req.body;
                if (!email || !password || !name) {
                    new response_util_1.default(400, false, "All fields are required", res);
                    return;
                }
                const existingUser = yield auth_service_1.default.getUserByEmail(email);
                if (existingUser) {
                    new response_util_1.default(400, false, "User already exists", res);
                    return;
                }
                const hashedPassword = yield (0, hash_1.hashPassword)(password);
                const data = {
                    name,
                    email,
                    password: hashedPassword,
                };
                console.log("Stored");
                const user = yield auth_service_1.default.registerUser(data);
                const token = jwt_1.tokenService.generateToken(user.id);
                const userResponse = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    token,
                };
                new response_util_1.default(400, true, "User registered successfully", res, userResponse);
                return;
            }
            catch (err) {
                console.log(err);
                new response_util_1.default(500, false, err.message, res);
                return;
            }
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Logging in!");
                const { email, password } = req.body;
                if (!email || !password) {
                    new response_util_1.default(401, false, "Email or Password incorrect!", res);
                    return;
                }
                const existingUser = yield auth_service_1.default.getUserByEmail(email);
                if (!existingUser) {
                    new response_util_1.default(401, false, "Email or Password incorrect!", res);
                    return;
                }
                const passwordMatch = yield (0, hash_1.comparePassword)(password, existingUser.password);
                if (!passwordMatch) {
                    new response_util_1.default(401, false, "Email or Password incorrect!", res);
                    return;
                }
                const token = jwt_1.tokenService.generateToken(existingUser.id);
                const userResponse = {
                    token,
                    id: existingUser.id,
                    name: existingUser.name,
                    email: existingUser.email,
                };
                new response_util_1.default(201, true, "User registered successfully", res, userResponse);
                return;
            }
            catch (err) {
                new response_util_1.default(500, false, err.message, res);
                return;
            }
        });
    }
}
exports.AuthController = AuthController;
