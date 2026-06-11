import "../styles/globals.css";
import Navbar from "../components/Navbar";
import { PreferredTeamProvider } from "../components/PreferredTeamContext";
import { ThemeProvider } from "../components/ThemeContext";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Router from "next/router";
import { Analytics } from "@vercel/analytics/react";

NProgress.configure({
  minimum: 0.3,
  easing: "ease",
  speed: 800,
  showSpinner: false,
});

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <PreferredTeamProvider>
        <Navbar />
        <Component {...pageProps} />
        <Analytics />
      </PreferredTeamProvider>
    </ThemeProvider>
  );
}

export default MyApp;
