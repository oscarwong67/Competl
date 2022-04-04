import clientPromise from "./mongodb";

export const addScore = async (userId, timeInMs, numGuesses, date) => {
  const client = await clientPromise;
  const db = await client.db();

  await db.collection("scores").insert({
    userId,
    timeInMs,
    numGuesses,
    date,
  });
};

export const getScoresWithUsernamesFromDate = async (today) => {
  const client = await clientPromise;
  const db = await client.db();

  const scores = await db.collection("scores").find({}).toArray();
  const users = await db.collection("users").find({}).toArray();
  const userIdsToUsernames = new Map();
  users.forEach((user) => {
    userIdsToUsernames.set(user._id, user.username);
  });
  return scores
    .filter(
      (score) =>
        score.date.getFullYear() === today.getFullYear() &&
        score.date.getMonth() === today.getMonth() &&
        score.date.getDate() === today.getDate()
    )
    .map((score) => {
      return { ...score, username: userIdsToUsernames.get(score.userId) };
    });
};
