import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#0a0a0a",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "#f5f5f5",
            borderRadius: "50% 50% 45% 45%",
            display: "flex",
            height: 24,
            position: "relative",
            width: 24,
          }}
        >
          <div
            style={{
              background: "#111827",
              borderRadius: "50%",
              height: 3,
              left: 6,
              position: "absolute",
              top: 9,
              width: 3,
            }}
          />
          <div
            style={{
              background: "#111827",
              borderRadius: "50%",
              height: 3,
              position: "absolute",
              right: 6,
              top: 9,
              width: 3,
            }}
          />
          <div
            style={{
              borderLeft: "4px solid transparent",
              borderRight: "4px solid transparent",
              borderTop: "5px solid #ff8906",
              height: 0,
              position: "absolute",
              left: 8,
              top: 14,
              width: 0,
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
