import { ImageResponse } from "next/og";

// 48px: Google's favicon crawler wants a multiple of 48; browsers
// scale it down for the tab.
export const size = {
  width: 48,
  height: 48,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#0a0a0a",
          border: "2px solid #3a3a3a",
          borderRadius: 12,
          color: "#ffffff",
          display: "flex",
          fontSize: 21,
          fontWeight: 700,
          height: "100%",
          justifyContent: "center",
          letterSpacing: "-0.5px",
          width: "100%",
        }}
      >
        TN
      </div>
    ),
    size,
  );
}
