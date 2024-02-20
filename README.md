# Sms1ir Documentation

## IData Interface

Represents the structure of the response data from the API.

```typescript
interface IData {
    status: number;
    message?: string;
    data?: any;
}
Sms1ir Class
Represents a class for interacting with the SMS1.ir API.

Constructor
Constructs a new Sms1ir instance.

Parameters
apiKeyWithoutPattern: The API key used for requests without a pattern.
apiKeyWithPattern: The API key used for requests with a pattern (optional).
Properties
apiKeyWithoutPattern: Private property for the API key used for requests without a pattern.
apiKeyWithPattern: Private property for the API key used for requests with a pattern.
apiUrl: The base URL of the SMS1.ir API.
maxRetries: The maximum number of retries for sending SMS messages.
retryInterval: The interval between retry attempts in milliseconds.
Methods
send(message: string, recipient: string): Promise<IData>
Sends a standard SMS message.

message: The message content.
recipient: The recipient's phone number.
Returns a promise that resolves with the API response data.
sendVerificationCode(verificationCode: string, recipient: string, patternId: number): Promise<IData>
Sends a verification code SMS message with retry and pattern support.

verificationCode: The verification code to send.
recipient: The recipient's phone number.
patternId: The ID of the pattern to use for the SMS.
Returns a promise that resolves with the API response data.
sendWithPattern(patternId: number, recipient: string, pairs: any): Promise<IData>
Sends an SMS message using a predefined pattern.

patternId: The ID of the pattern to use for the SMS.
recipient: The recipient's phone number.
pairs: The key-value pairs to replace in the pattern.
Returns a promise that resolves with the API response data.
Private Methods
sendWithRetry(message: string, recipient: string, retries: number = 0): Promise<IData>
Sends an SMS message with retry support.

message: The message content.
recipient: The recipient's phone number.
retries: The number of retry attempts (default is 0).
Returns a promise that resolves with the API response data.
```
