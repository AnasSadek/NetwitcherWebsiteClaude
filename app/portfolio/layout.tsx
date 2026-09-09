import type { Viewport } from "next";
import { DarkStage } from "@/components/portfolio/DarkStage";

export const viewport: Viewport = {
  themeColor: "#0b0620",
};

/** Portfolio-Bühne: dunkel, eigenständig, aber mit Header/Footer der Site. */
export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-void text-white">
      <DarkStage />
      {children}
    </div>
  );
}
