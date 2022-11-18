import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Box } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import GroupsIcon from "@mui/icons-material/Groups";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { flexbox } from "@mui/system";

const Navbar = () => {
  const router = useRouter();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-around",
        paddingY: "20px",
      }}
    >
      <Link
        href="/"
        className={router.pathname == "/" ? "link active" : "link"}
      >
        <HomeIcon /> HOME
      </Link>
      <Link
        href="/teams"
        className={router.pathname == "/teams" ? "link active" : "link"}
      >
        <GroupsIcon /> TEAMS
      </Link>
      <Link
        href="/fixtures"
        className={router.pathname == "/fixtures" ? "link active" : "link"}
      >
        <ReceiptLongIcon />
        FIXTURES
      </Link>
    </Box>
  );
};

export default Navbar;
