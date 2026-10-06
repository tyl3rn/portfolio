import { ImageResponse } from "next/og";

// 48px: Google's favicon crawler wants a multiple of 48; browsers
// scale it down for the tab.
export const size = {
  width: 48,
  height: 48,
};

export const contentType = "image/png";

// The site's penguin in the shades from the hero photo, on a 16x16 grid so
// every pixel lands on a whole pixel at 16, 32, and 48px. Teal tile so it
// shows up on light and dark tab bars alike.
const PIXELS = [
  ".............G..",
  ".....BBBBBB.GGG.",
  "....BBBBBBBB.G..",
  "...BBBBBBBBBB...",
  "..SSSSSSSSSSSS..",
  "..SGSSSWWSGSSS..",
  "..BSSSWWWWSSSB..",
  "..BWWWWOOWWWWB..",
  ".BBWWWWWWWWWWBB.",
  "BBBWWWWWWWWWWBBB",
  "BBBWWWWWWWWWWBBB",
  ".BBWWWWWWWWWWBB.",
  "..BWWWWWWWWWWB..",
  "..BBWWWWWWWWBB..",
  "...BBBBBBBBBB...",
  "...OOO....OOO...",
];
const COLORS: Record<string, string> = {
  B: "#2b313b", // body, a touch lighter than the shades so they read
  W: "#f4f7f9", // face and belly
  S: "#000000", // shades
  G: "#ffffff", // glint and sparkle
  O: "#ff8906", // beak and feet
};
const CELL = size.width / 16;

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#167fa3",
          borderRadius: 9,
          display: "flex",
          height: "100%",
          position: "relative",
          width: "100%",
        }}
      >
        {PIXELS.flatMap((row, y) =>
          Array.from(row, (c, x) =>
            c === "." ? null : (
              <div
                key={`${x}-${y}`}
                style={{
                  background: COLORS[c],
                  height: CELL,
                  left: x * CELL,
                  position: "absolute",
                  top: y * CELL,
                  width: CELL,
                }}
              />
            )
          )
        )}
      </div>
    ),
    size,
  );
}
