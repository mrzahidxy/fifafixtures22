import { useRouter } from "next/router";
import Link from "next/link";
import { Box, IconButton, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import GroupsIcon from "@mui/icons-material/Groups";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import TableChartIcon from "@mui/icons-material/TableChart";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useThemeMode } from "./ThemeContext";

const Navbar = () => {
  const router = useRouter();
  const { themeMode, toggleThemeMode } = useThemeMode();
  const isDark = themeMode === "dark";

  return (
    <Box
      component="nav"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "var(--color-nav-bg)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <Box
        sx={{
          width: "min(1180px, 100%)",
          margin: "0 auto",
          padding: { xs: "12px 14px", sm: "14px 16px", md: "16px 24px" },
          display: "flex",
          alignItems: "center",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          gap: { xs: "10px", sm: "18px" },
          minWidth: 0,
        }}
      >
        <Typography
          component={Link}
          href="/"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            color: "var(--color-text)",
            fontWeight: 900,
            letterSpacing: 0,
            whiteSpace: "nowrap",
            width: { xs: "100%", sm: "auto" },
            fontSize: { xs: "1rem", sm: "1.05rem" },
          }}
        >
          <Box
            component="img"
            src="/assets/icon.png"
            alt=""
            aria-hidden="true"
            sx={{
              width: 34,
              height: 34,
              borderRadius: "8px",
              objectFit: "cover",
              flex: "0 0 auto",
            }}
          />
          World Cup Hub
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: "10px", md: "18px" },
            width: { xs: "100%", sm: "auto" },
            maxWidth: "100%",
            minWidth: 0,
          }}
        >
          <Box
            className="nav-links"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: "14px", md: "22px" },
              overflowX: "auto",
              paddingBottom: { xs: "4px", sm: "2px" },
              maxWidth: "100%",
              minWidth: 0,
            }}
          >
            <Link
              href="/"
              className={router.pathname == "/" ? "link active" : "link"}
            >
              <HomeIcon /> Home
            </Link>
            <Link
              href="/fixtures"
              className={router.pathname == "/fixtures" ? "link active" : "link"}
            >
              <ReceiptLongIcon />
              Fixtures
            </Link>
            <Link
              href="/teams"
              className={router.pathname == "/teams" ? "link active" : "link"}
            >
              <GroupsIcon /> Teams
            </Link>
            <Link
              href="/standings"
              className={router.pathname == "/standings" ? "link active" : "link"}
            >
              <TableChartIcon /> Standings
            </Link>
            <Link
              href="/scorers"
              className={router.pathname == "/scorers" ? "link active" : "link"}
            >
              <EmojiEventsIcon /> Scorers
            </Link>
          </Box>

          <IconButton
            className="theme-toggle"
            onClick={toggleThemeMode}
            size="small"
            aria-label={isDark ? "Switch to normal mode" : "Switch to dark mode"}
          >
            {isDark ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Navbar;
