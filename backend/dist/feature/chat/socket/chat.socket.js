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
exports.setupSocket = setupSocket;
const logger_middleware_1 = __importDefault(require("../../../middlewares/logger.middleware"));
const chat_service_1 = require("../services/chat.service");
const client_1 = require("@prisma/client");
const onlineTracker_1 = require("./onlineTracker");
const prisma = new client_1.PrismaClient();
const chatService = new chat_service_1.ChatService();
function broadcastPresenceToConversation(io, conversationId, userId, online) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get all participants of the conversation (you already have a way)
        const participants = yield chatService.getConversationParticipants(conversationId);
        for (const p of participants) {
            if (p.id === userId)
                continue;
            // Emit to every socket of that participant
            const sockets = onlineTracker_1.onlineUsers.get(p.id);
            if (sockets) {
                for (const sid of sockets) {
                    io.to(sid).emit(online ? "userOnline" : "userOffline", { userId });
                }
            }
        }
    });
}
function setupSocket(io) {
    io.on("connection", (socket) => __awaiter(this, void 0, void 0, function* () {
        logger_middleware_1.default.info(`Socket connected: ${socket.id}`);
        const userId = socket.handshake.auth.userId;
        if (!userId) {
            socket.disconnect(true);
            return;
        }
        (0, onlineTracker_1.addOnline)(userId, socket.id);
        yield prisma.user.update({
            where: { id: userId },
            data: { lastSeen: new Date() },
        });
        const userConversations = yield chatService.getUserConversationIds(userId);
        for (const convId of userConversations) {
            yield broadcastPresenceToConversation(io, convId, userId, true);
        }
        socket.on("joinConversation", (_a) => __awaiter(this, [_a], void 0, function* ({ conversationId }) {
            socket.join(conversationId);
            logger_middleware_1.default.info(`User ${userId} joined conversation ${conversationId}`);
            const other = yield chatService.getOtherParticipant(conversationId, userId);
            if (other) {
                socket.emit("userPresence", {
                    userId: other.id,
                    online: (0, onlineTracker_1.isOnline)(other.id),
                    lastSeen: other.lastSeen,
                });
            }
        }));
        socket.on("sendMessage", (_a) => __awaiter(this, [_a], void 0, function* ({ conversationId, content, }) {
            try {
                const message = yield chatService.sendMessage({ conversationId, content }, userId);
                yield chatService.updateConversationLastMessage(conversationId, message.id);
                io.to(conversationId).emit("receiveMessage", message);
                logger_middleware_1.default.info(`Message sent in conversation ${conversationId} by user ${userId}`);
            }
            catch (err) {
                logger_middleware_1.default.error("Error sending message:", err);
            }
        }));
        const handleDisconnect = (reason) => __awaiter(this, void 0, void 0, function* () {
            logger_middleware_1.default.info(`Socket ${socket.id} disconnected – ${reason}`);
            (0, onlineTracker_1.removeOnline)(userId, socket.id);
            if (!onlineTracker_1.onlineUsers.has(userId)) {
                // update DB
                yield prisma.user.update({
                    where: { id: userId },
                    data: { lastSeen: new Date() },
                });
                // tell every conversation the user left
                const convs = yield chatService.getUserConversationIds(userId);
                for (const convId of convs) {
                    yield broadcastPresenceToConversation(io, convId, userId, false);
                }
            }
        });
        socket.on("disconnect", () => handleDisconnect("client disconnect"));
        socket.on("logout", () => handleDisconnect("logout"));
    }));
}
// import { Server, Socket } from "socket.io";
// import logger from "../../../middlewares/logger.middleware";
// import { SendMessageDto } from "../dtos/chat.dto";
// import { ChatService } from "../services/chat.service";
// const chatService = new ChatService();
// export function setupSocket(io: Server) {
//   io.on("connection", (socket: Socket) => {
//     logger.info(`User connected: ${socket.id}`);
//     socket.on("joinConversation", ({ conversationId, userId }) => {
//       socket.join(conversationId);
//       logger.info(`User ${userId} joined conversation ${conversationId}`);
//     });
//     socket.on(
//       "sendMessage",
//       async ({
//         conversationId,
//         userId,
//         content,
//       }: SendMessageDto & { userId: string }) => {
//         try {
//           const message = await chatService.sendMessage(
//             { conversationId, content },
//             userId
//           );
//           await chatService.updateConversationLastMessage(
//             conversationId,
//             message.id
//           );
//           io.to(conversationId).emit("receiveMessage", message);
//           logger.info(
//             `Message sent in conversation ${conversationId} by user ${userId}`
//           );
//         } catch (err) {
//           logger.error("Error sending message:", err);
//         }
//       }
//     );
//     socket.on("disconnect", () => {
//       logger.info(`User disconnected: ${socket.id}`);
//     });
//   });
// }
