"use client";
import React from "react";
import Dynamic from "./Dynamic";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  // Function to handle wallet connection (placeholder)
  const handleConnectWallet = () => {
    console.log("Connecting to wallet...");
    // Implement wallet connection logic here
  };

  return (
    <header className="p-2 flex justify-between items-center">
      {/* App Name */}
      <div className="text-lg font-bold w-1/4 px-10 flex">
        <Image src="/qubix-logo.png" alt="Qubix Logo" width={50} height={50} />
        <span className="my-2 mx-1 text-[#383536] text-3xl">Qubix</span>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex w-1/2 justify-center items-center font-bold text-lg">
        <Link
          href="/builder"
          className="hover:text-[#383536] transition-colors mx-4"
        >
          Builder
        </Link>
        <Link href="/games" className="hover:text-[#383536] transition-colors">
          Games
        </Link>
      </nav>

      {/* Dynamic Widget */}
      <div className="w-1/4 flex justify-end">
        <Dynamic />
      </div>
    </header>
  );
};

export default Header;
