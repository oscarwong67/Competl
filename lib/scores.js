import { ObjectId } from "mongodb";
import clientPromise from "./mongodb";

export const addScore = async (userId, timeInMs, numGuesses, date) => {
  const client = await clientPromise;
  const db = await client.db();
  const dateStr = date.toString();

  const newScore = {
    userId,
    timeInMs,
    numGuesses,
    dateStr,
  };
  await db.collection("scores").insert(newScore);

  const scores = await getScoresWithUsernamesFromDate(date);
  const index = scores.findIndex((score) => (score.userId === userId));
  if (index >= 0) {
    return index + 1;
  }
  return null;
};

export const getScoresWithUsernamesFromDate = async (today) => {
  const client = await clientPromise;
  const db = await client.db();

  const scores = await db.collection("scores").find({}).toArray();
  const users = await db.collection("users").find({}).toArray();
  const userIdsToUsernames = new Map();
  users.forEach((user) => {
    userIdsToUsernames.set(user._id.toString(), user.username);
  });
  const scoresWithUsernames = scores
    .filter((score) => {
      const scoreDate = new Date(score.dateStr);
      return (
        scoreDate.getFullYear() === today.getFullYear() &&
        scoreDate.getMonth() === today.getMonth() &&
        scoreDate.getDate() === today.getDate()
      );
    })
    .map((score) => {
      return {
        ...score,
        username: userIdsToUsernames.get(score.userId),
      };
    });
  return scoresWithUsernames.sort((a, b) => a.timeInMs - b.timeInMs);
};
