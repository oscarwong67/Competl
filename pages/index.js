import Head from 'next/head'
import Image from 'next/image'
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Typography from '@mui/material/Typography';

import Game from '../components/game';
import Login from '../components/login';
import SetUsername from '../components/setUsername';
import styles from '../styles/Home.module.css';
import HelpMenuDialog from '../components/helpMenuDialog';
import EditProfileDialog from '../components/editProfileDialog';
import NewUserDialog from '../components/newUserDialog';

import { signIn, signOut, useSession } from "next-auth/react"


export default function Home() {
  const { data: session, status } = useSession()

  return (
    <div className={styles.container}>
      <Head>
        <title>Competl</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppBar position="static">
        <Toolbar>
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
          <Typography variant="h6" nowrap component="div" sx={{ flexGrow: 1, display: { xs: 'block' } }}>Competl</Typography>
          <IconButton
            size="large"
            color="inherit"
            aria-label="help"
            sx={{ mr: 2 }}
          >
            {/* <HelpOutlineIcon /> */}
            <HelpMenuDialog/>
          </IconButton>
          <IconButton
            size="large"
            color="inherit"
            aria-label="profile"
            sx={{ mr: 2 }}
          >
            {/* <AccountCircleIcon /> */}
            <EditProfileDialog/>
          </IconButton>
        </Toolbar>
      </AppBar>
      <NewUserDialog newAccount={true}/>
      <main className={styles.main}>
        {/* <p className={styles.description}>A competitive word guessing game.</p> */}
        <Game />
        {/* <Login disableBackdropClick /> */}
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

// AUTHENTICATION TODO:
// Add users to database after login
// Add select username screen
// Clean up login screen ui
