const photos: { src: string; alt: string }[] = [
  // { src: "/photos/photo1.jpg", alt: "description" },
];

export default function Gallery() {
  return (
    <div className="flex flex-col gap-10 pt-2">
      <p className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">gallery</p>

      {photos.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {photos.map(({ src, alt }, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt={alt}
              className="aspect-square w-full object-cover"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square w-full border border-neutral-200 flex items-center justify-center"
            >
              <span className="font-mono text-[10px] text-neutral-300">photo</span>
            </div>
          ))}
        </div>
      )}

      <p className="font-mono text-[10px] text-neutral-400">
        add photos to /public/photos and update the array in gallery/page.tsx.
      </p>
    </div>
  );
}
