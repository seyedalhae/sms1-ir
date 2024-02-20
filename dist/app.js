"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.get("/users", (req, res) => {
    const users = [
        { id: 1, name: "John" },
        { id: 2, name: "Alice" },
        { id: 3, name: "Bob" },
    ];
    res.json(users);
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
