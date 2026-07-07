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
            alignItems: "center",
            background: "#f3f4f6",
            borderRadius: "50%",
            display: "flex",
            height: 27,
            justifyContent: "center",
            position: "relative",
            width: 27,
          }}
        >
          <div
            style={{
              background: "#111827",
              borderRadius: "50%",
              height: 18,
              left: 1,
              position: "absolute",
              top: 4,
              width: 11,
            }}
          />
          <div
            style={{
              background: "#111827",
              borderRadius: "50%",
              height: 18,
              position: "absolute",
              right: 1,
              top: 4,
              width: 11,
            }}
          />
          <div
            style={{
              background: "#f3f4f6",
              borderRadius: "50%",
              height: 20,
              position: "absolute",
              top: 3,
              width: 15,
            }}
          />
          <div
            style={{
              background: "#111827",
              borderRadius: "50%",
              height: 3,
              left: 9,
              position: "absolute",
              top: 11,
              width: 3,
            }}
          />
          <div
            style={{
              background: "#111827",
              borderRadius: "50%",
              height: 3,
              position: "absolute",
              right: 9,
              top: 11,
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
              top: 15,
              width: 0,
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
