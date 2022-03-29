import '../styles/globals.css'
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material";
import { SessionProvider } from "next-auth/react"

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={createTheme({ palette: { mode: "dark" } })}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
   </SessionProvider>
    //<ThemeProvider theme={createTheme({ palette: { mode: "dark" } })}>
    //  <CssBaseline />
    //  <Component {...pageProps} />
    //</ThemeProvider>
    //<SessionProvider session={session}>
    //  <Component {...pageProps}/>
    //</SessionProvider>
  );
}

export default MyApp