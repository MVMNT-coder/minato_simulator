// /sim/age/[age] — 静的書き出し用に全年代を事前生成
import { LIFE_AGE_SEQUENCE } from "@/lib/game/lifeSim/types";
import Client from "./Client";

export const dynamicParams = false;

export function generateStaticParams() {
  return LIFE_AGE_SEQUENCE.map((age) => ({ age: String(age) }));
}

export default function Page() {
  return <Client />;
}
