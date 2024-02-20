require("dotenv").config();

const apiKeyWithoutPattern = process.env.API_KEY_WITHOUT_PATTERN;
const apiKeyWithPattern = process.env.API_KEY_WITH_PATTERN;
const sampleMobile = process.env.SAMPLE_MOBILE;
const sampleMobile2 = process.env.SAMPLE_MOBILE2;
const sampleMobile3 = process.env.SAMPLE_MOBILE3;

interface IData {
	status: number;
	message?: string;
	data?: any;
}

export class Sms1ir {
	private apiKeyWithoutPattern: string;
	private apiKeyWithPattern: string | null;
	private apiUrl: string = "https://app.sms1.ir:7001/api/service/";
	private maxRetries: number = 3;
	private retryInterval: number = 1000;
	constructor(apiKeyWithoutPattern: string, apiKeyWithPattern?: string) {
		this.apiKeyWithoutPattern = apiKeyWithoutPattern;
		this.apiKeyWithPattern = apiKeyWithPattern ?? null;
	}

	private async Api(
		urlSuffix: string,
		method: "GET" | "POST" | "DELETE" = "POST",
		data: object | undefined = undefined,
		usePatternApiKey: boolean = false
	): Promise<IData> {
		const url = `${this.apiUrl}${urlSuffix}`;
		const apiKey = usePatternApiKey
			? this.apiKeyWithPattern
			: this.apiKeyWithoutPattern;

		const response = await fetch(url, {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`,
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

	async bulkSend(message: string, recipient: string[]) {
		try {
			const responses = await Promise.all(
				recipient.map((el) => this.send(message, el))
			);
			return responses;
		} catch (error) {
			console.error("Error sending bulk SMS:", error);
			throw new Error("Failed to send bulk SMS");
		}
	}

	async sendVerificationCode(
		verificationCode: string,
		recipient: string,
		patternId: number
	) {
		const message = `Your verification code is: ${verificationCode}`;
		try {
			// First, send the verification code with retry
			// const retryResponse = await this.sendWithRetry(message, recipient);
			// console.log("retryResponse: ", retryResponse);

			// if (retryResponse.status !== 200 && patternId) {
			const sendWithPattern = await this.sendWithPattern(
				patternId,
				recipient,
				{
					otpCode: verificationCode,
				}
			);
			// }

			// Next, send the verification code with pattern
			// const patternResponse = await this.sendWithPattern(
			// 	patternId,
			// 	recipient,
			// 	{ verificationCode }
			// );

			// Return the responses
			return sendWithPattern;
		} catch (error) {
			console.error("Error sending verification code:", error);
			throw new Error("Failed to send verification code");
		}
	}

	async sendWithPattern(patternId: number, recipient: string, pairs: any) {
		try {
			const responseBody = await this.Api(
				"patternSend",
				"POST",
				{
					patternId,
					recipient,
					pairs,
				},
				true
			);
			return responseBody;
		} catch (error) {
			console.error("Error sending SMS with pattern:", error);
			throw new Error("Failed to send SMS with pattern");
		}
	}

	private async sendWithRetry(
		message: string,
		recipient: string,
		retries: number = 0
	): Promise<IData> {
		try {
			const responseBody = await this.Api("send", "POST", {
				message,
				recipient,
			});
			return responseBody;
		} catch (error) {
			console.error(`Error sending SMS to ${recipient}:`, error);
			if (retries < this.maxRetries) {
				console.log(
					`Retrying SMS to ${recipient} (retry ${retries + 1} of ${
						this.maxRetries
					})`
				);
				await new Promise((resolve) =>
					setTimeout(resolve, this.retryInterval)
				);
				return this.sendWithRetry(message, recipient, retries + 1);
			} else {
				console.error(
					`Failed to send SMS to ${recipient} after ${this.maxRetries} retries`
				);
				throw new Error("Failed to send SMS");
			}
		}
	}
}

export default Sms1ir;
