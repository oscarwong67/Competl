import '../styles/globals.css'
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material";
import { SessionProvider, useSession } from "next-auth/react"

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      {Component.auth ? (
        <Auth>
          <ThemeProvider theme={createTheme({ palette: { mode: "dark" } })}>
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        </Auth>
      ) : (
        <ThemeProvider theme={createTheme({ palette: { mode: "dark" } })}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      )}
    </SessionProvider>
  );
}

function Auth({ children }) {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status } = useSession({ required: true });

  if (status === "loading") {
    // TODO: make this slightly nicer
    return <div>Loading...</div>;
  }

  return children;
}