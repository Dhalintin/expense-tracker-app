"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onlineUsers = void 0;
exports.addOnline = addOnline;
exports.removeOnline = removeOnline;
exports.isOnline = isOnline;
exports.onlineUsers = new Map();
function addOnline(userId, socketId) {
    let set = exports.onlineUsers.get(userId);
    if (!set) {
        set = new Set();
        exports.onlineUsers.set(userId, set);
    }
    set.add(socketId);
}
function removeOnline(userId, socketId) {
    const set = exports.onlineUsers.get(userId);
    if (set) {
        set.delete(socketId);
        if (set.size === 0)
            exports.onlineUsers.delete(userId);
    }
}
function isOnline(userId) {
    return exports.onlineUsers.has(userId);
}
