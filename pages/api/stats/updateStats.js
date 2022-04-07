import { updateStatsOnGameCompletion } from "../../../lib/users";

export default async function handler(req, res) {
  const { userId, isWin, numGuesses, leaderboardPosition } = req.query;
  await updateStatsOnGameCompletion(
    userId,
    isWin,
    numGuesses,
    leaderboardPosition
  );

  res.status(200).json(stats);
}
