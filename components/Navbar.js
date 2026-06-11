import { useRouter } from "next/router";
import Link from "next/link";
import { Box, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import GroupsIcon from "@mui/icons-material/Groups";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import TableChartIcon from "@mui/icons-material/TableChart";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const Navbar = () => {
  const router = useRouter();

  return (
    <Box
      component="nav"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "rgba(21, 28, 46, 0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <Box
        sx={{
          width: "min(1180px, 100%)",
          margin: "0 auto",
          padding: { xs: "14px 16px", md: "16px 24px" },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "18px",
        }}
      >
        <Typography
          component={Link}
          href="/"
          sx={{
            color: "var(--color-text)",
            fontWeight: 900,
            letterSpacing: 0,
            whiteSpace: "nowrap",
          }}
        >
          World Cup Hub
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: "16px", md: "22px" },
            overflowX: "auto",
            paddingBottom: "2px",
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
      </Box>
    </Box>
  );
};

export default Navbar;
