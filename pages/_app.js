import '../styles/globals.css'
// import ThemeProvider from "@material-ui/core/styles/ThemeProvider";
import { createTheme, ThemeProvider } from "@mui/material";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={createTheme({palette: {mode: 'dark'}})}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp
