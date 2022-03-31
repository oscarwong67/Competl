import { getScoresWithUsernamesFromDate } from "../../lib/scores";

export default async function handler(req, res) {
  const { dateString } = req.query;
  const scores = await getScoresWithUsernamesFromDate(new Date(dateString));

  res.status(200).json(scores);
}
