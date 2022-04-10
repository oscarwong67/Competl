import { updateDateLastPlayed } from "../../../lib/users";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }
  const userId = req.body.userId;
  const dateStr = req.body.dateStr;
  await updateDateLastPlayed(userId, dateStr);
  res.status(200).json({ message: "Date Last Played Set" });
}
