import { addScore } from "../../../lib/scores";

export default async function handler(req, res) {
  const { userId, timeInMs, numGuesses, dateString } = req.query;
  const position = await addScore(
    userId,
    timeInMs,
    numGuesses,
    new Date(dateString)
  );

  res.status(200).json(position);
}