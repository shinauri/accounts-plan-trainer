import React from "react";

interface BraceSvgProps {
  height?: number; // Approximate height to match the text lines
  width?: number;
  strokeWidth?: number;
  className?: string;
}

const BraceSvg: React.FC<BraceSvgProps> = ({
  height = 100,
  width = 100,
  strokeWidth = 1.5,
  className = "",
}) => {
  // This SVG path creates a right-facing curly brace.
  // viewBox width is 20, height is adjusted by the `height` prop.
  // The path is scaled proportionally.
  // M0,0           -> Move to top-left
  // C15,0 15,${height/2} 0,${height/2} -> Top curve control points for cubic Bezier
  // C15,${height/2} 15,${height} 0,${height}   -> Bottom curve control points
  // M0,${height/2} L-5,${height/2}   -> Line for the middle pointer (optional, can be adjusted)
  // A more standard brace would be symmetrical. Let's use one that points from the middle.
  // Path: Move to top, curve to mid-left, line to point, line from point, curve to bottom.
  // Height should be roughly 2x line height + spacing
  // width of brace itself can be small, like 10-15px

  return (
    <svg
      width={width}
      height={height}
      viewBox="10 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 21C11.1046 21 12 20.1046 12 19V15.3255C12 14.8363 12 14.5917 12.0553 14.3615C12.1043 14.1575 12.1851 13.9624 12.2947 13.7834C12.4184 13.5816 12.5914 13.4086 12.9373 13.0627L14 12L12.9373 10.9373C12.5914 10.5914 12.4184 10.4184 12.2947 10.2166C12.1851 10.0376 12.1043 9.84254 12.0553 9.63846C12 9.40829 12 9.1637 12 8.67452V5C12 3.89543 11.1046 3 10 3"
        stroke="#000000"
        stroke-width={strokeWidth}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default BraceSvg;
