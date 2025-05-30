"use client";

import React from "react";

// Helper component for the editable divs
export default function TAccount({ initialText = "?" }) {
  return (
    <div
      contentEditable="true"
      className="p-2 min-h-[2em] focus:outline-none" // min-h for a decent height, p-2 for padding
      suppressContentEditableWarning={true} // Suppresses React warning for contentEditable
    >
      {initialText}
    </div>
  );
}
