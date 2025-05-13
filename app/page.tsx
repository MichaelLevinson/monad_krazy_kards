import { Metadata } from "next";
import App from "@/components/pages/app";
import { APP_URL } from "@/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "🃏 Monad Krazy Kards 🃏",
    description: "The social card game that'll make your degen friends FOMO!",
    openGraph: {
      title: "🃏 Monad Krazy Kards 🃏",
      description: "The social card game that'll make your degen friends FOMO!",
      images: [{ url: `${APP_URL}/images/game-promo.png` }]
    },
    other: {
      // Frame metadata using the latest vNext format
      "fc:frame": "vNext",
      "fc:frame:image": `${APP_URL}/images/game-promo.png`,
      "fc:frame:button:1": "Play Krazy Kards!",
      "fc:frame:post_url": `${APP_URL}/api/frame`,
      "fc:frame:button:1:action": "post_redirect"
    },
  };
}

export default function Home() {
  return <App />;
}