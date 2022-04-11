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
import {
  getWordOfDay,
  checkLetter,
} from "../lib/words";
import { getFormattedTime } from "../lib/utils";
import Snackbar from "@mui/material/Snackbar";

export default function Statistics(props) {
  const { data: session } = useSession();
  const [guessDistributionProportions, setGuessDistributionProportions] = useState(
    {}
  );
  const [isMacOsLike, setIsMacOsLike] = useState(false);
  const { fetchStats } = props;
  const { guessDistribution } = props.stats;
  const [shareSnackbarOpen, setShareSnackbarOpen] = useState(false);

  // Fetch stats on first load
  useEffect(() => {    
    const fetchStatsWrapper = async () => {
      console.log("Fetching Stats on First Load");
      await fetchStats();
    }
    fetchStatsWrapper();
    if (navigator.userAgent.search("Mac OS") != -1) {
      setIsMacOsLike(true);
    }
  }, [fetchStats]);

  // Recalculate guess distribution bar lengths when stats change
  useEffect(() => {
    function calcGuessDistributionProportions(guessDistribution) {
      if (!guessDistribution) return;
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
    }
    calcGuessDistributionProportions(guessDistribution);
  }, [guessDistribution]);

  useEffect(() => {

  })

  const getShareIcon = () => {
    if (isMacOsLike) {
      return <IosShareIcon />;
    } else {
      return <ShareIcon />;
    }
  };

  function share() {
    let clipboard = "";
  
    let d = new Date();
    let month = (d.getMonth() + 1).toString();
    let day = d.getDate().toString();
    let year = d.getFullYear();
    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    let date = localStorage.getItem('shareDate')
    clipboard += "Competl "+year+"-"+month+"-"+day+"\n";
      
    let username = session.user.username;
    console.log("username: ",username);
    let position = localStorage.getItem('position')
    if (position != null)
      clipboard += username+", Rank: "+position+"\n\n";
    else
      clipboard += username+", Rank: -\n\n";
  
    let target = getWordOfDay().solution.toUpperCase();
    console.log("target: "+target);
  
    const guesses = JSON.parse(localStorage.getItem('guesses'));
    console.log("guesses: ",guesses);
  
    for (const guess of guesses) {

      let compareGuess = guess.word.toUpperCase();
      let row = "";
  
      for (var i = 0; i < compareGuess.length; i++) {
        let checked = checkLetter(compareGuess, target, i);
        console.log("checked: ",checked);
        if (checked == 2) {
          row = row+"🟩";
        } else if (checked == 1) {
          row = row+"🟨";
        } else {
          row = row+"⬛";
        }
      }
      clipboard += row + " " + getFormattedTime(guess.time) + "\n";
    }
  
    const numGuesses = localStorage.getItem('numGuesses');
  
    navigator.clipboard.writeText(clipboard);

  };

  const renderGuessDistribution = () => {
    if (!(props.stats.guessDistribution)) return null;
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
            {props.stats.guessDistribution[num]}
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
          <IconButton size="large" aria-label="share" onClick={() => {
            share();
            setShareSnackbarOpen(true);
          }}>
            {getShareIcon()}
          </IconButton>
          <Snackbar
            open={shareSnackbarOpen}
            autoHideDuration={3000}
            onClose={() => {
              setShareSnackbarOpen(false);
            }}
            message="Copied to clipboard"
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} justifyContent="space-around">
        <Grid item xs={2}>
          <Typography variant="h6">
            &nbsp;{props.stats.numGamesPlayed}
          </Typography>
          <Typography variant="p">&nbsp;Played</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="h6">
            {Math.floor(
              (props.stats.numGamesWon * 100) / props.stats.numGamesPlayed
            ) || "-"}
            %
          </Typography>
          <Typography variant="p">Win %</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="h6">{props.stats.currentStreak}</Typography>
          <Typography variant="p">Current Streak</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="h6">{props.stats.maxStreak}</Typography>
          <Typography variant="p">Max Streak</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h6">
            {parseInt(props.stats.highestLeaderPosition) ===
            Number.MAX_SAFE_INTEGER
              ? "-"
              : props.stats.highestLeaderPosition}
          </Typography>
          <Typography variant="p">Highest Leaderboard Position</Typography>
        </Grid>
      </Grid>
      {renderGuessDistribution()}
    </div>
  );
}
