import clientPromise from "./mongodb";

/*
 * Assume user is in the format:
 * {
 *  "_id": string,
 *  "email": string,
 *  "username": string
 */
export const updateStatsOnGameCompletion = async (
  user,
  isWin,
  numGuesses,
  leaderBoardPosition
) => {
  const client = await clientPromise;
  const db = await client.db();

  const { _id, email, username } = user;

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
  const stats = await db.collection("users").find({ _id }).next();
  const { numGamesPlayed, numGamesWon, currentStreak, maxStreak, highestLeaderPosition, guessDistribution } = stats;

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
    const { username, _id } = user;
    return { _id, email, username };
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
    return { _id: result.insertedId.toString(), email, username: null };
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
