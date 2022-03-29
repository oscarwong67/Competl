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

/*
 * Assume user is in the format:
 * {
 *  "_id": string,
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
  const client = await clientPromise;
  const db = await client.db();

  const {
    _id,
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
      _id,
    },
    newStats
  );
};

export const addUserToDbIfNotExist = async (email) => {
  const client = await clientPromise;
  const db = await client.db();

  const findCursor = await db.collection("users").find({ email });
  if (await findCursor.hasNext()) {
    const user = await findCursor.next();
    return user;
  } else {
    const newUser = {
      email,
      username: null,
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
    };
    const result = await db.collection("users").insertOne(newUser);
    return { ...newUser, _id: result.insertedId.toString() };
  }
};

export const updateUserName = async (userId, username) => {
  const client = await clientPromise;
  const db = await client.db();

  await db.collection("users").update(
    {
      _id: userId,
    },
    { $set: { username: username } }
  );
};
