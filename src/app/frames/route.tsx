/* eslint-disable react/jsx-key */
import { createFrames, Button } from "frames.js/next";

const totalPages = 3;

export const frames = createFrames({
  basePath: "/frames",
});

const handleRequest = frames(async (ctx) => {
  let pageIndex = Number(ctx.searchParams.pageIndex || 0);
  if (pageIndex !== 0 && ctx.message?.inputText == "FARCASTER") {
    pageIndex += 1;
  }

  const imageUrl = `https://picsum.photos/seed/frames.js-${pageIndex}/300/200`;

  return {
    image: (
      <div tw="flex flex-col">
        <span>Unscramble the word CRAFETSRA</span>
      </div>
    ),
    buttons: [
      <Button action="post" target="/next">
        Submit
      </Button>,
    ],
    textInput: "Answer",
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
