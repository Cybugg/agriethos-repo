"use client";

import React, { useState } from "react";

type CopyButtonProps = {
  textToCopy: string;
};

export default function CopyButton({ textToCopy }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500); // reset after 1.5s
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div className="">
      <button
        onClick={handleCopy}
        className="text-black bg-[#a5eb4c] p-3 px-5 w-28"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      
    </div>
  );
}
