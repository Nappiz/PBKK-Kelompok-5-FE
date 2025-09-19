type Props = {
  image: string;
  title: string;
  subtitle: string;
};

export default function FeatureCard({ image, title, subtitle }: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl ring-1 ring-black/10">
      {/* gambar */}
      <img
        src={image}
        alt={title}
        className="h-56 w-full object-cover md:h-64"
        draggable={false}
      />

      {/* overlay gradien + teks */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <h3 className="font-inter text-white/95 text-lg font-semibold drop-shadow">
          {title}
        </h3>
        <p className="font-inter text-white/85 text-sm">{subtitle}</p>
      </div>

      {/* bevel halus */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/20" />
    </div>
  );
}
