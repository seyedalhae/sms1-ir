# SMS1.ir API

`sms1-ir` allows you to communicate with the SMS1.ir API to send SMS messages. The API key for your SMS1.ir accounts is required to create a new instance of the sms1ir class.

## Installation

This package is available on npm as [`sms1-ir`](https://www.npmjs.com/package/sms1-ir). You can install it using either npm or yarn.

With npm:

```bash
npm install sms1-ir
```

With yarn:

```bash
yarn ass sms1-ir
```

## Using

To use this class in your Javascript or Typescript code, first import it:

```javascript
import { sms1ir } from "sms1-ir";
```

Then create a new instance of the sms1ir class using your SMS1.ir API key.

```javascript
const sms = new sms1ir = ("YOUR_COMMON_API_KEY", "YOUR_PATTERN_API_KEY");
```

Then you can use the methods of the sms1ir class to interact with the SMS1.ir API. For example, to send a single SMS message to a single recipient:

```javascript
sms.send("Hi Sir!", "RECIPIENT_MOBILE_NUMBER");
```
