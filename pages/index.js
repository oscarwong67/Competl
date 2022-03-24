import Head from 'next/head'
import Image from 'next/image'
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import IconButton from "@mui/material/IconButton";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import Game from '../components/game';
import styles from '../styles/Home.module.css';
import HelpMenu from '../components/helpMenu';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Competl</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppBar position="static">
        <Toolbar>
          <Box display="flex" flexGrow={1}>
            {/* Left Side */}
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <WorkspacePremiumIcon />
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
          <IconButton
            size="large"
            color="inherit"
            aria-label="help"
            sx={{ mr: 2 }}
          >
            {/* <HelpOutlineIcon /> */}
          <HelpMenu />
          </IconButton>
          <IconButton
            size="large"
            color="inherit"
            aria-label="profile"
            sx={{ mr: 2 }}
          >
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <main className={styles.main}>
        <h1 className={styles.title}>Competl</h1>
        <p className={styles.description}>A competitive word guessing game.</p>
        <Game />
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
