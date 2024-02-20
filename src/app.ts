import express, { Request, Response } from "express";
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const apiKey = process.env.API_KEY;
const sampleMobile = process.env.SAMPLE_MOBILE;

interface IData {
	status: number;
	message?: string;
	data?: any;
}

export class Sms1ir {
	private apiKey: string;
	private apiUrl: string = "https://app.sms1.ir:7001/api/service/";

	constructor(apiKey: string) {
		this.apiKey = apiKey;
	}

	private async Api(
		urlSuffix: string,
		method: "GET" | "POST" | "DELETE" = "POST",
		data: object | undefined = undefined
	): Promise<IData> {
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

		const contentType = response.headers.get("content-type");
		if (
			response.status == 200 &&
			(!contentType || !contentType.includes("application/json"))
		) {
			return { status: 200 };
		}

		try {
			const responseBody = await response.json();
			console.log("Response Body:", responseBody);
			return responseBody;
		} catch (error) {
			console.error("Error parsing JSON:", error);
			throw new Error("Invalid JSON response from server");
		}
	}

	async send(message: string, recipient: string) {
		try {
			const responseBody = await this.Api("send", "POST", {
				message,
				recipient,
			});
			return responseBody;
		} catch (error) {
			console.error("Error sending SMS:", error);
			throw new Error("Failed to send SMS");
		}
	}
}

// app.use(express.json());

app.post("/sms", async (req: Request, res: Response) => {
	try {
		const payload = req.body;
		console.log("payload: ", payload);

		const sms = new Sms1ir(apiKey!);
		const sms1 = await sms.send("Hello World!", sampleMobile!);

		res.json({ response: sms1 });
	} catch (error) {
		console.error("Error in /users route:", error);
		res.status(500).json({ error: "Failed to process request" });
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
