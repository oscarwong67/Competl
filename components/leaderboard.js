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

export default function Leaderboard(props) {
  const [scores, setScores] = useState([]);

  // only runs on component mount
  useEffect(() => {
    async function fetchScores() {
      const res = await fetch(
        `/api/scores?dateString=${new Date().toString()}`
      );
      const todayScores = await res.json();
      setScores(todayScores);
    }
    fetchScores();
  }, []);

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={props.isOpen}
      ModalProps={{
        keepMounted: true,
      }}
      onClose={props.toggleDrawer}
      PaperProps={{
        sx: { width: "90%" },
      }}
    >
      <Statistics />
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
        <Grid item xs={12}>
          <Typography variant="h6" component="div" gutterBottom align="center">
            Filter By # Guesses
          </Typography>
        </Grid>
        <Grid container item xs={12} spacing={1}>
          <Grid item xs={2}>
            <Button variant="text" align="center" size="small">
              1
            </Button>
          </Grid>
          <Grid item xs={2}>
            <Button variant="text" align="center" size="small">
              2
            </Button>
          </Grid>
          <Grid item xs={2}>
            <Button variant="text" align="center" size="small">
              3
            </Button>
          </Grid>
          <Grid item xs={2}>
            <Button variant="text" align="center" size="small">
              4
            </Button>
          </Grid>
          <Grid item xs={2}>
            <Button variant="text" align="center" size="small">
              5
            </Button>
          </Grid>
          <Grid item xs={2}>
            <Button variant="text" align="center" size="small">
              6
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={11}>
          <TextField
            id="outlined-search"
            label="Name"
            type="search"
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
              {/* TODO: put some scores in the DB and see how it goes + work on scrolling etc; might need to use datagrid instead so i can scroll */}
              {/* Also look at https://mui.com/components/tables/#sticky-header */}
              {scores.map((score, idx) => (
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
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </Drawer>
  );
}
