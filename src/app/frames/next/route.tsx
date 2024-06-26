/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "../route";

const handleRequest = frames(async (ctx) => {
  return {
    image: (
      <span>
        {ctx.message?.inputText == "FARCASTER" ? "Correct ✅" : "Incorrect ❌"}
      </span>
    ),
    buttons: [],
  };
});

export const POST = handleRequest;
