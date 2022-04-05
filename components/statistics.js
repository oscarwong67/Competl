import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import BarChartIcon from "@mui/icons-material/BarChart";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ShareIcon from "@mui/icons-material/Share";
import IosShareIcon from "@mui/icons-material/IosShare";
import IconButton from "@mui/material/IconButton";
import styles from "../styles/Statistics.module.css";

export default function Statistics(props) {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState({});
  const [guessDistributionProportions, setGuessDistributionProportions] = useState(
    {}
  );
  const [isMacOsLike, setIsMacOsLike] = useState(false);

  useEffect(() => {
    function calcGuessDistributionProportions(guessDistribution) {
      const max = Math.max.apply(null, Object.values(guessDistribution));

      const proportions = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
      };

      Object.keys(proportions).forEach((key) => {
        proportions[key] = guessDistribution[key] / max;
      });
      setGuessDistributionProportions(proportions);
    };

    async function fetchStats() {
      const res = await fetch(`/api/stats/getStats?userId=${session.user._id}`);
      const fetchedStats = await res.json();
      const {
        currentStreak,
        guessDistribution,
        highestLeaderPosition,
        maxStreak,
        numGamesPlayed,
        numGamesWon,
      } = fetchedStats;
      setStats({
        currentStreak,
        guessDistribution,
        highestLeaderPosition,
        maxStreak,
        numGamesPlayed,
        numGamesWon,
      });
      calcGuessDistributionProportions(guessDistribution);
    }
    fetchStats();
    if (navigator.userAgent.search("Mac OS") != -1) {
      setIsMacOsLike(true);
    }
  }, [session.user._id]);

  const getShareIcon = () => {
    if (isMacOsLike) {
      return <IosShareIcon />;
    } else {
      return <ShareIcon />;
    }
  };

  const renderGuessDistribution = () => {
    if (!(stats.guessDistribution)) return null;
    const guessDistributionElements = [1, 2, 3, 4, 5, 6].map((num) => (
      <Grid item container key={num}>
        <Grid item xs={2}>
          <Typography variant="p">{num}</Typography>
        </Grid>
        <Grid item xs={9} sx={{ display: "flex" }}>
          <div
            className={`${styles.bar} ${styles.accentedBg}`}
            style={{ width: `${100 * guessDistributionProportions[num]}%` }}
          ></div>
        </Grid>
        <Grid item xs={1} sx={{ textAlign: "center" }}>
          <Typography variant="subtitle1" className={styles.accentedText}>
            {stats.guessDistribution[num]}
          </Typography>
        </Grid>
      </Grid>
    ));
    return (
      <Grid
        container
        sx={{ padding: 1 }}
        direction="column"
        spacing={1}
      >
        {guessDistributionElements}
      </Grid>
    );
  }

  return (
    <div id="statistics-container">
      <Grid container>
        <Grid item xs={4} sx={{ paddingLeft: 1 }}>
          <IconButton size="large" aria-label="back" onClick={props.back}>
            <ArrowBackIosNewIcon />
          </IconButton>
        </Grid>
        <Grid item xs={4} justifyContent="center" sx={{ display: "flex" }}>
          <BarChartIcon fontSize="large" sx={{ alignSelf: "center" }} />
          &nbsp;
          <Typography variant="h5" sx={{ alignSelf: "center" }}>
            Statistics
          </Typography>
        </Grid>
        <Grid
          item
          xs={4}
          sx={{ display: "flex", justifyContent: "flex-end", paddingRight: 1 }}
        >
          <IconButton size="large" aria-label="share">
            {getShareIcon()}
          </IconButton>
        </Grid>
      </Grid>
      <Grid container spacing={2} justifyContent="space-around">
        <Grid item xs={2}>
          <Typography variant="h6">&nbsp;{stats.numGamesPlayed}</Typography>
          <Typography variant="p">&nbsp;Played</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="h6">
            {Math.floor((stats.numGamesWon * 100) / stats.numGamesPlayed) ||
              "-"}
            %
          </Typography>
          <Typography variant="p">Win %</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="h6">{stats.currentStreak}</Typography>
          <Typography variant="p">Current Streak</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="h6">{stats.maxStreak}</Typography>
          <Typography variant="p">Max Streak</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h6">
            {stats.highestLeaderPosition || "-"}
          </Typography>
          <Typography variant="p">Highest Leaderboard Position</Typography>
        </Grid>
      </Grid>
      {renderGuessDistribution()}
    </div>
  );
}
