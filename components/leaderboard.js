import { useState, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import Statistics from "./statistics";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { getFormattedTime } from "../lib/utils";
import RefreshIcon from "@mui/icons-material/Refresh";
import IconButton from "@mui/material/IconButton";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

export default function Leaderboard(props) {
  const [nameSearchQuery, setNameSearchQuery] = useState("");
  const { fetchScores } = props;
  const [filterGuess, setFilterGuess] = useState('0');

  // only runs on component mount
  useEffect(() => {
    console.log("Fetching Scores on First Load");
    fetchScores();
  }, [fetchScores]);

  const handleFilterChange = (event, newFilter) => {
    setFilterGuess(newFilter);
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={props.isOpen}
      ModalProps={{
        keepMounted: true,
      }}
      PaperProps={{
        sx: { width: "90%" },
      }}
    >
      <Statistics back={props.toggleDrawer} fetchStats={props.fetchStats} stats={props.stats} />
      <Divider />
      <Box>
        <WorkspacePremiumIcon />
        &nbsp;
        <Typography variant="h5" component="span" gutterBottom>
          Today&apos;s Leaderboard
        </Typography>
      </Box>
      <Divider />
      <Grid
        id="leaderboard-section"
        container
        spacing={2}
        justifyContent="center"
      >
        {/* Spacer */}
        <Grid item xs={2} />
        <Grid item xs={8}>
          <Typography variant="h6" component="div" gutterBottom align="center">
            Filter By # of Guesses
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <IconButton size="large" aria-label="back" onClick={props.fetchScores}>
            <RefreshIcon />
          </IconButton>
        </Grid>
        {/* # Guess Buttons */}
        <ToggleButtonGroup
          value={filterGuess}
          exclusive
          aria-label="filter guesses"
          onChange={handleFilterChange}
          color="secondary"
          size="large"
        >
           <ToggleButton value="0" aria-label="all">
            All
          </ToggleButton>
          <ToggleButton value="1" aria-label="one">
            1
          </ToggleButton>
          <ToggleButton value="2" aria-label="two">
            2
          </ToggleButton>
          <ToggleButton value="3" aria-label="three">
            3
          </ToggleButton>
          <ToggleButton value="4" aria-label="four">
            4
          </ToggleButton>
          <ToggleButton value="5" aria-label="five">
            5
          </ToggleButton>
          <ToggleButton value="6" aria-label="six">
            6
          </ToggleButton>
        </ToggleButtonGroup>
        <Grid item xs={11}>
          <TextField
            id="outlined-search"
            label="Name"
            type="search"
            value={nameSearchQuery}
            onChange={(event) => setNameSearchQuery(event.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>Username</TableCell>
                <TableCell align="right"># Guesses</TableCell>
                <TableCell align="right">Solve Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* TODO: scrolling - might need to use datagrid instead, but maybe we can do it manually too */}
              {/* Also look at https://mui.com/components/tables/#sticky-header */}
              {props.scores.filter((score) => {
                  if(parseInt(filterGuess) === 0) {
                    return true;
                  } else {
                    return score.numGuesses === parseInt(filterGuess);
                  }
                }).map((score, idx) => (
                <TableRow
                  key={idx + 1}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {idx + 1}.
                  </TableCell>
                  <TableCell>{score.username}</TableCell>
                  <TableCell align="right">{score.numGuesses}</TableCell>
                  <TableCell align="right">
                    {getFormattedTime(score.timeInMs)}
                  </TableCell>
                </TableRow>
              ))
              }
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </Drawer>
  );
}
