// GitHub Pages などサブパス配信時のベースパス(静的アセット用)。
// next.config.ts で NEXT_PUBLIC_BASE_PATH を設定する。Link / router.push は自動で付与されるため不要。
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const withBase = (path: string): string => `${BASE_PATH}${path}`;
