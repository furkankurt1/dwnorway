import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "Dawah Norway",
    description:
      "An invitation to Islam in Norway. Educating communities, distributing free Qurans, and supporting new Muslims since 2021.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#bfa055",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    lang: "en",
    dir: "ltr",
    categories: ["education", "religion", "non-profit"],
  };
}
