import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#faf8ff",
};

/** Portfolio-Bühne: hell und ruhig, mit Header/Footer der Site. */
export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-paper text-ink">{children}</div>
  );
}
