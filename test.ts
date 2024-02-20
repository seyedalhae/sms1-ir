// import axios, { type AxiosRequestConfig } from "axios";

const DefaultPageSize = 100;

type ILineNumber = string | number;
type IParameter = {
	name: string;
	value: string;
};

interface Data_Base {
	status: number;
	message: string;
	data: any;
}

interface Data_SendBulk extends Data_Base {
	data: {
		packId: string;
		messageIds: number[];
		cost: number;
	};
}
interface Data_SendWithUsername extends Data_Verify {}
interface Data_LikeToLike extends Data_SendBulk {}
interface Data_DeleteScheduled extends Data_Base {
	data: {
		returnedCreditCount: number;
		smsCount: number;
	};
}
interface Data_Verify extends Data_Base {
	data: {
		messageId: number;
		cost: number;
	};
}

interface ReportSingle {
	messageId: number;
	mobile: string;
	messageText: string;
	sendDateTime: number;
	lineNumber: ILineNumber;
	cost: number;
	deliveryState: number;
	deliveryDateTime: number;
}
interface ReportPack {
	packId: string;
	recipientCount: number;
	creationDateTime: number;
}
interface ReceiveSingle {
	messageText: string;
	number: ILineNumber;
	mobile: string;
	receivedDateTime: number;
}
interface Data_Report_Message extends Data_Base {
	data: ReportSingle;
}
interface Data_Report_TodayPacks extends Data_Base {
	data: ReportPack[];
}

interface Data_Report_Messages extends Data_Base {
	data: ReportSingle[];
}
interface Data_Report_Today extends Data_Report_Messages {}
interface Data_Report_Pack extends Data_Report_Messages {}
interface Data_Report_Archive extends Data_Report_Messages {}

interface Data_Receive_Messages extends Data_Base {
	data: ReceiveSingle[];
}
interface Data_Receive_Latest extends Data_Receive_Messages {}
interface Data_Receive_Today extends Data_Receive_Messages {}
interface Data_Receive_Archive extends Data_Receive_Messages {}

interface Data_Credit extends Data_Base {
	data: number;
}
interface Data_Lines extends Data_Base {
	data: ILineNumber[];
}

export class Smsir {
	private ApiKey: string;
	private LineNumber: ILineNumber;
	private Username: string | null;
	public readonly ApiUrl = "https://api.sms.ir/v1";

	/**
	 * Create a new instance of the Smsir class
	 * @param {string} ApiKey - The API key for the SMS.ir account
	 * @param {number} LineNumber - The  line number to use for sending messages
	 * @param {string} [Username=null] - The username for the SMS.ir account
	 */
	constructor(
		ApiKey: string,
		LineNumber: ILineNumber,
		Username: string | null = null
	) {
		this.ApiKey = ApiKey;
		this.LineNumber = LineNumber;
		this.Username = Username;
		return this;
	}

	/**
	 * Make an API request to the SMS.ir API
	 * @private
	 * @param {string} urlSuffix - The URL suffix for the API endpoint
	 * @param {("GET"|"POST"|"DELETE")} [method="GET"] - The HTTP method to use for the request
	 * @param {object|null} [data=null] - The data to send with the request
	 * @returns {Promise} The response from the API
	 */
	private async Api(
		urlSuffix: string,
		method: "GET" | "POST" | "DELETE" = "GET",
		data: object | undefined = undefined
	): Promise<Data_Base> {
		const response = await fetch(`${this.ApiUrl}/${urlSuffix}`, {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"X-API-KEY": this.ApiKey,
			},
			method,
			body: data && JSON.stringify(data),
		});
		const responseBody = await response.json();

		return responseBody?.data;
	}

	/**
	 * Send a single SMS message to a single recipient
	 * @param {string} MessageText - The text of the message to send
	 * @param {string} Mobile - The mobile number of the recipient
	 * @param {number|null} [SendDateTime=null] - The Unix timestamp of when to send the message (null for immediate sending)
	 * @param {number} [LineNumber=this.LineNumber] - The line number to use for sending the message
	 * @returns {Promise} The response from the API
	 */
	async Send(
		MessageText: string,
		Mobile: string,
		SendDateTime: number | null = null,
		LineNumber: ILineNumber = this.LineNumber
	): Promise<Data_SendBulk> {
		return this.SendBulk(MessageText, [Mobile], SendDateTime, LineNumber);
	}

	/**
	 * Send a single SMS message to a single recipient (The username for the SMS.ir account is required)
	 * @param {string} messageText - The text of the message to send
	 * @param {string} mobile - The mobile number of the recipient
	 * @param {ILineNumber} [lineNumber=this.LineNumber] - The line number to use for sending the message
	 * @param {string} [username=this.Username] - The username for the SMS.ir account
	 * @returns {Promise} The response from the API
	 */
	async SendWithUsername(
		messageText: string,
		mobile: string,
		lineNumber: ILineNumber = this.LineNumber,
		username: string | null = this.Username
	): Promise<Data_SendWithUsername> {
		return this.Api(
			"send?" +
				new URLSearchParams({
					username: username ?? "",
					password: this.ApiKey,
					line: "" + lineNumber,
					mobile,
					text: messageText,
				}),
			"GET"
		);
	}

	async SendBulk(
		MessageText: string,
		Mobiles: Array<string>,
		SendDateTime: number | null = null,
		lineNumber: ILineNumber = this.LineNumber
	): Promise<Data_SendBulk> {
		return this.Api("send/bulk", "POST", {
			lineNumber,
			MessageText,
			Mobiles,
			SendDateTime,
		});
	}

	/**
	 * Send multiple SMS messages to multiple recipients (one message per recipient)
	 * @param {string} MessageTexts - The text of the messages to send
	 * @param {Array<string>} Mobiles - An array of mobile numbers of the recipients
	 * @param {number|null} [SendDateTime=null] - The Unix timestamp of when to send the message (null for immediate sending)
	 * @param {ILineNumber|null} [lineNumber=null] - The line number to use for sending the message (null for  line number)
	 * @returns {Promise} The response from the API
	 */
	async SendLikeToLike(
		MessageTexts: string,
		Mobiles: Array<string>,
		SendDateTime: number | null = null,
		lineNumber: ILineNumber = this.LineNumber
	): Promise<Data_LikeToLike> {
		return this.Api("send/likeToLike", "POST", {
			lineNumber,
			MessageTexts,
			Mobiles,
			SendDateTime,
		});
	}

	/**
	 * Delete a scheduled SMS message
	 * @param {number} PackId - The ID of the scheduled message pack to delete
	 * @returns {Promise} The response from the API
	 */
	async DeleteScheduled(PackId: number): Promise<Data_DeleteScheduled> {
		return this.Api(`send/scheduled/${PackId}`, "DELETE");
	}

	/**
	 * Send a verification code via SMS
	 * @param {string} Mobile - The mobile number of the recipient
	 * @param {number} TemplateId - The ID of the verification code template to use
	 * @param {} Parameters - An array of parameters to use in the verification code template
	 * @returns {Promise} The response from the API
	 */
	async SendVerifyCode(
		Mobile: string,
		TemplateId: number,
		Parameters: IParameter[]
	): Promise<Data_Verify> {
		return this.Api("send/verify", "POST", {
			Mobile,
			TemplateId,
			Parameters,
		});
	}

	/**
	 * Get a report on a specific sent SMS message
	 * @param {number} MessageId - The ID of the sent message to get a report on
	 * @returns {Promise} The response from the API
	 */
	async ReportMessage(MessageId: number): Promise<Data_Verify> {
		return this.Api(`send/${MessageId}`);
	}

	/**
	 * Get a report on today's sent SMS messages
	 * @param {number} [pageSize=DefaultPageSize] - The number of results to return per page
	 * @param {number} [pageNumber=1] - The page number to return results for
	 * @returns {Promise} The response from the API
	 */
	async ReportTodayPacks(
		pageSize: number = DefaultPageSize,
		pageNumber: number = 1
	): Promise<Data_Report_TodayPacks> {
		return this.Api("send/pack", "GET", {
			pageSize,
			pageNumber,
		});
	}

	/**
	 * Get a report on a specific sent SMS message pack
	 * @param {number} PackId - The ID of the sent message pack to get a report on
	 * @returns {Promise} The response from the API
	 */
	async ReportPack(PackId: number): Promise<Data_Report_Pack> {
		return this.Api(`send/pack/${PackId}`);
	}

	/**
	 * Get a report on today's sent SMS messages
	 * @param {number} [pageSize=DefaultPageSize] - The number of results to return per page
	 * @param {number} [pageNumber=1] - The page number to return results for
	 * @returns {Promise} The response from the API
	 */
	async ReportToday(
		pageSize: number = DefaultPageSize,
		pageNumber: number = 1
	): Promise<Data_Report_Today> {
		return this.Api("send/live", "GET", {
			pageSize,
			pageNumber,
		});
	}

	/**
	 * Get a report on archived sent SMS messages
	 * @param {null} [fromDate=null] - The start date to get results for (null for no start date)
	 * @param {null} [toDate=null] - The end date to get results for (null for no end date)
	 * @param {number} [pageSize=DefaultPageSize] - The number of results to return per page
	 * @param {number} [pageNumber=1] - The page number to return results for
	 * @returns {Promise} The response from the API
	 */
	async ReportArchived(
		fromDate: number | null = null,
		toDate: number | null = null,
		pageSize: number = DefaultPageSize,
		pageNumber: number = 1
	): Promise<Data_Report_Archive> {
		return this.Api("send/archive", "GET", {
			fromDate,
			toDate,
			pageSize,
			pageNumber,
		});
	}

	/**
	 * Get a report on the latest received SMS messages
	 * @param {number} [count=DefaultPageSize] - The number of results to return
	 * @returns {Promise} The response from the API
	 */
	async ReportLatestReceived(
		count: number = DefaultPageSize
	): Promise<Data_Receive_Latest> {
		return this.Api("receive/latest", "GET", { count });
	}

	/**
	 * Get a report on today's received SMS messages
	 * @param {number} [pageSize=DefaultPageSize] - The number of results to return per page
	 * @param {number} [pageNumber=1] - The page number to return results for
	 * @returns {Promise} The response from the API
	 */
	async ReportTodayReceived(
		pageSize: number = DefaultPageSize,
		pageNumber: number = 1
	): Promise<Data_Receive_Today> {
		return this.Api("receive/live", "GET", {
			pageSize,
			pageNumber,
		});
	}

	/**
	 * Get a report on archived received SMS messages
	 * @param {null} [fromDate=null] - The start date to get results for (null for no start date)
	 * @param {null} [toDate=null] - The end date to get results for (null for no end date)
	 * @param {number} [pageSize=DefaultPageSize] - The number of results to return per page
	 * @param {number} [pageNumber=1] - The page number to return results for
	 * @returns {Promise} The response from the API
	 */
	async ReportArchivedReceived(
		fromDate: number | null = null,
		toDate: number | null = null,
		pageSize: number = DefaultPageSize,
		pageNumber: number = 1
	): Promise<Data_Receive_Archive> {
		return this.Api("receive/archive", "GET", {
			fromDate,
			toDate,
			pageSize,
			pageNumber,
		});
	}

	/**
	 * Get the remaining credit balance for the SMS.ir account
	 * @returns {Promise} The response from the API
	 */
	async GetCredit(): Promise<Data_Credit> {
		return this.Api("credit");
	}

	/**
	 * Get a list of available line numbers for the SMS.ir account
	 * @returns {Promise} The response from the API
	 */
	async GetLineNumbers(): Promise<Data_Lines> {
		return this.Api("line");
	}
}

export default Smsir;
