import { ObjectId } from "mongodb";
import clientPromise from "./mongodb";

export const addScore = async (userId, timeInMs, numGuesses, date) => {
  const client = await clientPromise;
  const db = await client.db();

  const newScore = {
    userId,
    timeInMs,
    numGuesses,
    date,
  };
  await db.collection("scores").insert(newScore);

  const scores = await getScoresWithUsernamesFromDate(date);
  const sortedScores = scores.sort((a, b) => a.timeInMs - b.timeInMs);
  const index = sortedScores.findIndex((score) => (score.userId = userId));
  console.log(index);
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
      const scoreDate = new Date(score.date);
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
  return scoresWithUsernames;
};
