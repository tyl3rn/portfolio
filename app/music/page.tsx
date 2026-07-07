const artists = [
  "[Artist 1]",
  "[Artist 2]",
  "[Artist 3]",
  "[Artist 4]",
  "[Artist 5]",
  "[Artist 6]",
];

export default function Music() {
  return (
    <div className="flex flex-col gap-10 pt-2">
      <p className="font-mono text-[10px] text-muted uppercase tracking-widest">music</p>

      <div className="flex flex-col gap-3">
        <p className="font-mono text-[10px] text-muted uppercase tracking-widest">
          currently listening
        </p>
        <div className="border border-line p-4 flex flex-col gap-1">
          <p className="text-sm font-medium">[song title]</p>
          <p className="font-mono text-[10px] text-muted">[artist], [album]</p>
        </div>
      </div>

      <hr className="border-line" />

      <div className="flex flex-col gap-3">
        <p className="font-mono text-[10px] text-muted uppercase tracking-widest">
          artists i love
        </p>
        <div className="flex flex-col gap-2">
          {artists.map((artist) => (
            <p key={artist} className="text-sm text-muted">
              {artist}
            </p>
          ))}
        </div>
      </div>

      <hr className="border-line" />

      <div className="flex flex-col gap-3">
        <p className="font-mono text-[10px] text-muted uppercase tracking-widest">vibe</p>
        <p className="text-sm text-muted leading-relaxed max-w-sm">
          [describe your taste: indie, hip-hop, lo-fi, bedroom pop, etc.]
        </p>
      </div>
    </div>
  );
}
