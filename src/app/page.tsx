import { fetchMetadata } from "frames.js/next";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Workspace from "@/components/Workspace";
import Toolbox from "@/components/Toolbox";
import Header from "@/components/Header";

export async function generateMetadata(queryParams: Record<string, string>) {
  const searchParams = new URLSearchParams(queryParams).toString();
  return {
    title: "My Page",
    // provide a full URL to your /frames endpoint with added query parameters
    other: await fetchMetadata(
      new URL(
        `/api/frame?${searchParams}`,
        process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000"
      )
    ),
  };
}

export default function Home() {
  return (
    <div>
      <Header />
      <div className="flex flex-row w-full">
        <Toolbox />
      </div>
    </div>
  );
}
