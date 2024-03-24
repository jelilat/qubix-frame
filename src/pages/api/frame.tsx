/* eslint-disable react/jsx-key */
import { createFrames, Button } from "frames.js/next";
import { NextApiRequest, NextApiResponse } from "next";
import type { Writable, Readable } from "node:stream";

const frames = createFrames();

const handleRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;
  const buttonValue = query ? query.buttonValue : "Not Specified";
  const pressedButton = query ? query.pressedButton === "true" : false;
  const searchParamsValue = query ? query.value : "";

  if (req.method === "POST") {
    console.log("POST request received");
  } else if (req.method === "GET") {
    console.log("GET request received");
  }

  const frameResponse = await frames(async (ctx) => {
    return {
      image: (
        <span>
          {ctx.pressedButton
            ? `I clicked ${ctx.searchParams.value}`
            : `Click some button`}
        </span>
      ),
      buttons: [
        <Button action="post" target={{ query: { value: "Yes" } }}>
          Say Yes
        </Button>,
        <Button action="post" target={{ query: { value: "No" } }}>
          Say No
        </Button>,
      ],
    };
  });

  const request = req as any;

  const response = await frameResponse(request);

  sendResponse(res, response);
};

async function sendResponse(res: NextApiResponse, response: Response) {
  res.statusMessage = response.statusText;
  res.statusCode = response.status;

  const headers = Object.fromEntries(response.headers.entries());
  Object.keys(headers).forEach((key) => {
    res.setHeader(key, headers[key]);
  });

  if (response.body) {
    await writeReadableStreamToWritable(response.body, res);
  } else {
    res.end();
  }
}

export async function writeReadableStreamToWritable(
  stream: ReadableStream,
  writable: Writable
) {
  let reader = stream.getReader();
  let flushable = writable as { flush?: Function };

  try {
    while (true) {
      let { done, value } = await reader.read();

      if (done) {
        writable.end();
        break;
      }

      writable.write(value);
      if (typeof flushable.flush === "function") {
        flushable.flush();
      }
    }
  } catch (error: unknown) {
    writable.destroy(error as Error);
    throw error;
  }
}

export default handleRequest;
