import fs from "node:fs/promises";
import path from "node:path";
import { TpaLanding } from "@/components/tpa-landing";
import { currentActor } from "@/lib/actor";
import { HomepageMedia } from "@/components/public-media";
export const dynamic = "force-dynamic";
export default async function Home() {
  const [html, actor, media] = await Promise.all([
    fs.readFile(path.join(process.cwd(), "theme/landing.html"), "utf8"),
    currentActor(),
    HomepageMedia(),
  ]);
  return <TpaLanding html={html} signedIn={Boolean(actor)} staff={Boolean(actor?.roles.length)} media={media} />;
}
