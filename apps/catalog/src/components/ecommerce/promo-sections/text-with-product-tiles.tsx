import { useState } from "react";
import { Badge } from "@hilum/ui";
import { Button } from "@hilum/ui";

const images = {
  main: "https://tailwindui.com/img/ecommerce-images/home-page-01-feature-section-01.jpg",
  tile1: "https://tailwindui.com/img/ecommerce-images/home-page-01-collection-01.jpg",
  tile2: "https://tailwindui.com/img/ecommerce-images/home-page-01-collection-02.jpg",
  tile3: "https://tailwindui.com/img/ecommerce-images/home-page-01-collection-03.jpg",
};

export default function TextWithProductTiles() {
  const [selectedTile, setSelectedTile] = useState("Desk Shelf");

  return (
    <div className="grid min-h-[340px] w-full overflow-hidden rounded-xl border border-ground-100 bg-white md:grid-cols-[0.82fr_1.18fr]">
      <div className="flex items-center border-b border-ground-100 px-8 py-10 md:border-b-0 md:border-r md:border-ground-100">
        <div className="max-w-sm">
          <Badge variant="brand">Desk favorites</Badge>
          <h2 className="display mt-5 text-ground-900">Everything your workspace needs</h2>
          <p className="body mt-3 text-ground-500">
            Start with versatile essentials, then layer in statement pieces that help the whole room
            feel considered.
          </p>
          <p className="caption mt-5 text-ground-400">Currently spotlighting: {selectedTile}</p>
          <div className="mt-6">
            <Button>Shop curated picks</Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 p-6">
        {[
          { title: "Desk Shelf", image: images.tile1 },
          { title: "Task Lamp", image: images.tile2 },
          { title: "Storage Tray", image: images.tile3 },
          { title: "Notebook Set", image: images.main },
        ].map((tile) => (
          <button
            key={tile.title}
            onMouseEnter={() => setSelectedTile(tile.title)}
            onClick={() => setSelectedTile(tile.title)}
            className={`overflow-hidden rounded-[24px] border text-left transition-colors ${
              selectedTile === tile.title
                ? "border-brand-primary shadow-natural"
                : "border-ground-100 hover:border-ground-200"
            }`}
          >
            <img src={tile.image} alt={tile.title} className="h-32 w-full object-cover" />
            <div className="bg-white p-4">
              <p className="body font-semibold text-ground-900">{tile.title}</p>
              <p className="caption mt-1 text-ground-400">Built for daily use</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
