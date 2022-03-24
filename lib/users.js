import clientPromise from "../../lib/mongodb";

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

/*
 * Assume user is in the format:
 * {
 *  "userId": string,
 *  "email": string,
 *  "username": string
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
export const updateStatsOnGameCompletion = async (
  user,
  isWin,
  numGuesses,
  leaderBoardPosition
) => {
  const {
    userId,
    email,
    username,
    numGamesPlayed,
    numGamesWon,
    currentStreak,
    maxStreak,
    highestLeaderPosition,
    guessDistribution,
  } = user;

  const newStreak = isWin ? currentStreak + 1 : 0;
  const newGuessDistribution = { ...guessDistribution };
  newGuessDistribution[numGuesses]++;

  const newStats = {
    email,
    username,
    numGamesPlayed: numGamesPlayed + 1,
    numGamesWon: isWin ? numGamesWon + 1 : numGamesWon,
    currentStreak: newStreak,
    maxStreak: Math.max(maxStreak, newStreak),
    highestLeaderPosition: Math.min(highestLeaderPosition, leaderBoardPosition),
    guessDistribution: newGuessDistribution,
  };
  await db.collection("users").update(
    {
      _id: userId,
    },
    newStats
  );
};

export const addUserToDb = async (email) => {
  await db.collection("users").insert({
    email,
    username: "TEMP_USERNAME",
    numGamesPlayed: 0,
    numGamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    highestLeaderPosition: null,
    guessDistribution: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
    },
  });
};

export const updateUserName = async (userId, username) => {
  await db.collection("users").update(
    {
      _id: userId,
    },
    { $set: { username: username } }
  );
};
