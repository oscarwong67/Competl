
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"
import BarChartIcon from "@mui/icons-material/BarChart";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ShareIcon from "@mui/icons-material/Share";
import IosShareIcon from "@mui/icons-material/IosShare";
import IconButton from "@mui/material/IconButton";

export default function Statistics(props) {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState({});
  const [isMacOsLike, setIsMacOsLike] = useState(false);

  // only runs on component mount
  useEffect(() => {
    async function fetchStats() {
      const res = await fetch(
        `/api/stats/getStats?userId=${session.user._id}`
      );
      const fetchedStats = await res.json();
      const { currentStreak, guessDistribution, highestLeaderPosition, maxStreak, numGamesPlayed, numGamesWon } = fetchedStats;
      setStats({ currentStreak, guessDistribution, highestLeaderPosition, maxStreak, numGamesPlayed, numGamesWon });
    }
    fetchStats();
    if (navigator.userAgent.search('Mac OS') != -1) {
      setIsMacOsLike(true);
    }
  }, [session.user._id]);

  const getShareIcon = () => {
    if (isMacOsLike) {
      return <IosShareIcon />
    } else {
      return <ShareIcon />
    }
  }

  return (
    <div id="statistics-container">
      <Grid container>
        <Grid item xs={4} sx={{ paddingLeft: 1 }}>
          <IconButton
            size="large"
            aria-label="back"
            onClick={props.back}
          ><ArrowBackIosNewIcon /></IconButton>
        </Grid>
        <Grid item xs={4} justifyContent="center" sx={{ display: "flex" }}>
          <BarChartIcon fontSize="large" sx={{alignSelf: "center"}}/>
          &nbsp;
          <Typography variant="h5" sx={{alignSelf: "center"}}>Statistics</Typography>
        </Grid>
        <Grid item xs={4} sx={{ display: "flex", justifyContent: "flex-end", paddingRight: 1 }}>
          <IconButton
            size="large"
            aria-label="share"
          >{getShareIcon()}</IconButton>
        </Grid>
      </Grid>
      <Grid container spacing={2} justifyContent='space-around'>
        <Grid item xs={2}>
          <Typography variant="h5">&nbsp;{stats.numGamesPlayed}</Typography>
          <Typography variant="p">&nbsp;Played</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="h5">{Math.floor(stats.numGamesWon * 100 / stats.numGamesPlayed) || '-'}%</Typography>
          <Typography variant="p">Win %</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="h5">{stats.currentStreak}</Typography>
          <Typography variant="p">Current Streak</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="h5">{stats.maxStreak}</Typography>
          <Typography variant="p">Max Streak</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h5">{stats.highestLeaderPosition || '-'}</Typography>
          <Typography variant="p">Highest Leaderboard Position</Typography>
        </Grid>
      </Grid>
      {/* TODO: distribution */}
    </div>
  );
}
