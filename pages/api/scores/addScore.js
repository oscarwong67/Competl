import { addScore } from "../../../lib/scores";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }
  const { userId, timeInMs, numGuesses, dateString } = req.body;
  const position = await addScore(
    userId,
    timeInMs,
    numGuesses,
    new Date(dateString)
  );

  res.status(200).json(position);
}