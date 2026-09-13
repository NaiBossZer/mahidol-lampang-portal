import { useState } from "react";
import GlobalHeader from "./public/GlobalHeader";
import GlobalFooter from "./public/GlobalFooter";
import HomePage from "./public/HomePage";
import ActivitiesPage from "./public/ActivitiesPage";
import ActivityDetailPage from "./public/ActivityDetailPage";
import ShellacPage from "./public/ShellacPage";
import SiteMapPage from "./public/SiteMapPage";
import StorefrontPage from "./public/StorefrontPage";
import SmartFarmPage from "./public/SmartFarmPage";
import LoginPage from "./public/LoginPage";

export type PublicPage =
  | "home"
  | "activities"
  | "activity-detail"
  | "shellac"
  | "sitemap"
  | "storefront"
  | "smart-farm"
  | "login";

export default function PublicPortal() {
  const [page, setPage] = useState<PublicPage>("home");

  const navigate = (p: PublicPage) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    switch (page) {
      case "home":
        return <HomePage navigate={navigate} />;
      case "activities":
        return <ActivitiesPage navigate={navigate} />;
      case "activity-detail":
        return <ActivityDetailPage navigate={navigate} />;
      case "shellac":
        return <ShellacPage navigate={navigate} />;
      case "sitemap":
        return <SiteMapPage />;
      case "storefront":
        return <StorefrontPage />;
      case "smart-farm":
        return <SmartFarmPage />;
      case "login":
        return <LoginPage navigate={navigate} />;
      default:
        return <HomePage navigate={navigate} />;
    }
  };

  if (page === "login") return <LoginPage navigate={navigate} />;

  return (
    <div className="min-h-full flex flex-col bg-[#F8F6F0]">
      <GlobalHeader currentPage={page} navigate={navigate} />
      <main className="flex-1">{renderPage()}</main>
      <GlobalFooter navigate={navigate} />
    </div>
  );
}
