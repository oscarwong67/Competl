import { ObjectId } from "mongodb";
import clientPromise from "./mongodb";

export const updateStatsOnGameCompletion = async (
  userId,
  isWin,
  numGuesses,
  leaderboardPosition
) => {
  const client = await clientPromise;
  const db = await client.db();

  /*
   * Get remaining stats:
   *  "numGamesPlayed": int
   *  "numGamesWon": int
   *  "currentStreak": int
   *  "maxStreak": int
   *  "highestLeaderPosition": int,
   *  "guessDistribution": {
          "1": int,
          "2": int,
          "3": int,
          "4": int,
          "5": int,
          "6": int,
        }
   * }
   */
  const stats = await db.collection("users").find({ _id: ObjectId(userId) }).next();
  let { numGamesPlayed, numGamesWon, currentStreak, maxStreak, highestLeaderPosition, guessDistribution } = stats;
  if (!highestLeaderPosition) {
    highestLeaderPosition = Number.MAX_SAFE_INTEGER;
  }

  const newStreak = isWin ? currentStreak + 1 : 0;
  const newGuessDistribution = { ...guessDistribution };
  if (isWin) {
    newGuessDistribution[numGuesses]++;
  }
  console.log(newGuessDistribution);
  console.log(numGuesses);
  const newStats = {
    numGamesPlayed: numGamesPlayed + 1,
    numGamesWon: isWin ? numGamesWon + 1 : numGamesWon,
    currentStreak: newStreak,
    maxStreak: Math.max(maxStreak, newStreak),
    highestLeaderPosition: Math.min(highestLeaderPosition, leaderboardPosition),
    guessDistribution: newGuessDistribution,
  };

  await db.collection("users").updateOne(
    {
      _id: ObjectId(userId),
    },
    { $set: newStats }
  );
};

export const addUserToDbIfNotExist = async (email) => {
  const client = await clientPromise;
  const db = await client.db();

  const findCursor = await db.collection("users").find({ email });
  if (await findCursor.hasNext()) {
    const user = await findCursor.next();
    const { username, _id, dateLastPlayedStr } = user;
    return { _id, email, username, dateLastPlayedStr };
  } else {
    const newUser = {
      email,
      username: null,
      numGamesPlayed: 0,
      numGamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      highestLeaderPosition: Number.MAX_SAFE_INTEGER,
      guessDistribution: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
      },
      dateLastPlayedStr: null,
    };
    const result = await db.collection("users").insertOne(newUser);
    return { _id: result.insertedId.toString(), email, username: null };
  }
};

export const updateUserName = async (userId, username) => {
  const client = await clientPromise;
  const db = await client.db();

  await db.collection("users").updateOne(
    {
      _id: ObjectId(userId),
    },
    { $set: { username: username } }
  );
};

export const updateDateLastPlayed = async (userId, dateStr) => {
  const client = await clientPromise;
  const db = await client.db();

  await db.collection("users").updateOne(
    {
      _id: ObjectId(userId),
    },
    { $set: { dateLastPlayedStr: dateStr } }
  );
}

export const getStatsForUserId = async (userId) => {
  const client = await clientPromise;
  const db = await client.db();

  const stats = await db.collection("users").find({ _id: ObjectId(userId) }).next();
  return stats;
}
