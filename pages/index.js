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
import styles from '../styles/Home.module.css';
import HelpMenuDialog from '../components/helpMenuDialog';
import EditProfileDialog from '../components/editProfileDialog';
import NewUserDialog from '../components/newUserDialog';
import Leaderboard from "../components/leaderboard";
import { signIn, signOut, useSession } from "next-auth/react"
import { useEffect, useState, useCallback } from 'react';


export default function Home() {
  const { data: session, status } = useSession()
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const [openNewUserPopup, setOpenNewUserPopup] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [scores, setScores] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    if (session && session.user && !session.user.username) {
      setOpenNewUserPopup(true);
    } else {
      setOpenNewUserPopup(false);
    }
  }, [session])

  const toggleDrawer = () => {
    setIsLeaderboardOpen(!isLeaderboardOpen);
  }  

  const fetchScores = useCallback(async () => {
    const res = await fetch(
      `/api/scores/getScores?dateString=${new Date().toString()}`
    );
    const todayScores = await res.json();
    setScores(todayScores);
  }, []);

  const fetchStats = useCallback(async () => {
    if (session) {
      const res = await fetch(`/api/stats/getStats?userId=${session.user._id}`);
      const fetchedStats = await res.json();
      setStats(fetchedStats);
      return fetchedStats;
    }
    return {};
  }, [session]);

  const refreshScoresAndStats = useCallback(async () => {
    console.log('Refreshing Stats and Leaderboard');
    fetchScores();
    fetchStats();
  }, [fetchScores, fetchStats]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Competl</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {session && (
        <AppBar position="static" >
          <Toolbar>
            <Box display="flex" flexGrow={1}>
              {/* Left Side */}
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={toggleDrawer}
              >
                <WorkspacePremiumIcon />
                <ArrowForwardIosIcon />
              </IconButton>
              <Leaderboard
                isOpen={isLeaderboardOpen}
                toggleDrawer={toggleDrawer}
                fetchScores={fetchScores}
                fetchStats={fetchStats}
                scores={scores}
                stats={stats}
              />
              <Typography
                variant="h6"
                nowrap="true"
                component="div"
                sx={{
                  flexGrow: 1,
                  display: { xs: "block", alignSelf: "center" },
                }}
              >
                Competl
              </Typography>
            </Box>
            <IconButton
              size="large"
              color="inherit"
              aria-label="help"
              sx={{ mr: 2 }}
            >
              {/* <HelpOutlineIcon /> */}
              <HelpMenuDialog />
            </IconButton>
            <IconButton
              size="large"
              color="inherit"
              aria-label="profile"
              sx={{ mr: 2 }}
            >
              {/* <AccountCircleIcon /> */}
              <EditProfileDialog
                openCallback={setOpenProfileMenu}
                isOpen={openProfileMenu}
                userId={session && session.user ? session.user._id : ""}
                currUsername={
                  session && session.user ? session.user.username : ""
                }
              />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}
      <NewUserDialog
        newAccount={openNewUserPopup}
        userId={session && session.user ? session.user._id : ""}
      />
      <main className={styles.main}>
        <p className={styles.description}>Competl</p>
        {/* <p className={styles.description}>A competitive word guessing game.</p> */}
        <Game refreshLeaderboard={refreshScoresAndStats} session={session} />
        {!session && <Login disableBackdropClick />}
      </main>
      {/* <footer className={styles.footer}>
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
      </footer> */}
    </div>
  );
}

Home.auth = true;