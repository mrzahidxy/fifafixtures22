import Link from "next/link";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import InboxIcon from "@mui/icons-material/Inbox";

const stateIcons = {
  error: ErrorOutlineIcon,
  "not-found": SearchOffIcon,
  empty: InboxIcon,
};

export default function PageState({
  type = "empty",
  title,
  message,
  actionLabel,
  actionHref,
  onAction,
}) {
  const StateIcon = stateIcons[type] || InboxIcon;
  const isLoading = type === "loading";

  return (
    <Box
      className={`empty-state page-state page-state-${type}`}
      role={type === "error" ? "alert" : "status"}
      aria-live={isLoading ? "polite" : undefined}
    >
      {isLoading ? (
        <CircularProgress
          size={32}
          aria-label="Loading"
          sx={{ color: "var(--color-gold)" }}
        />
      ) : (
        <StateIcon className="page-state-icon" aria-hidden="true" />
      )}
      <Box>
        <Typography component="h2" className="page-state-title">
          {title}
        </Typography>
        {message && (
          <Typography className="page-state-message">{message}</Typography>
        )}
      </Box>
      {actionLabel && (actionHref || onAction) && (
        <Button
          component={actionHref ? Link : "button"}
          href={actionHref}
          onClick={onAction}
          variant="outlined"
          aria-label={actionLabel}
          sx={{
            color: "var(--color-gold)",
            borderColor: "var(--color-gold)",
            fontWeight: 800,
          }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
