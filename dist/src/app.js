"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sms1ir = void 0;
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
class Sms1ir {
    constructor(apiKey) {
        this.apiUrl = "https://app.sms1.ir:7001/api/service/";
        this.apiKey = apiKey;
    }
    async Api(urlSuffix, method = "POST", data = undefined) {
        const url = `${this.apiUrl}${urlSuffix}`;
        console.log("API URL:", url);
        const response = await fetch(url, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.apiKey}`,
            },
            method,
            body: JSON.stringify(data),
        });
        console.log("Response Status:", response.status);
        // if (!response.ok) {
        // 	throw new Error(
        // 		`API request failed with status ${response.status}`
        // 	);
        // }
        const contentType = response.headers.get("content-type");
        if (response.status == 200 &&
            (!contentType || !contentType.includes("application/json"))) {
            return 200;
        }
        try {
            const responseBody = await response.json();
            console.log("Response Body:", responseBody);
            return responseBody;
        }
        catch (error) {
            console.error("Error parsing JSON:", error);
            throw new Error("Invalid JSON response from server");
        }
    }
    async send(message, recipient) {
        try {
            const responseBody = await this.Api("send", "POST", {
                message,
                recipient,
            });
            return responseBody;
        }
        catch (error) {
            console.error("Error sending SMS:", error);
            throw new Error("Failed to send SMS");
        }
    }
}
exports.Sms1ir = Sms1ir;
// app.use(express.json());
app.post("/users", async (req, res) => {
    try {
        const payload = req.body;
        console.log("payloadddd: ", payload);
        const sms = new Sms1ir("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJUYVpSWGhwaGs4Tis5dlNqNUUvcEg5SzZLWFl4VkFCOGpRZWY3NDdxNDVZPSIsImlzcyI6Imh0dHBzOi8vc21zMS5pci8iLCJpYXQiOiIxNzA4MzU1MzQ1IiwiVXNlcklkIjoiMTkwMjAiLCJBY2NvdW50SWQiOiIyMjY4MSIsIkMiOiI5Vmo4ZkdTbTFzOTQ3T0pOempsMHR3PT0iLCJEIjoiMTQxNDYiLCJCIjoiMSIsIkEiOiIxMzQiLCJFIjoiNDQzMSIsIkYiOiIzIiwiYXVkIjoiQW55In0.DqxbW5W254DQ2S8Y-djvqE63iTf-_0_reUwOKWN8cEo");
        const sms1 = await sms.send("Hello World!", "09105660150");
        res.json({ response: sms1 });
    }
    catch (error) {
        console.error("Error in /users route:", error);
        res.status(500).json({ error: "Failed to process request" });
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
