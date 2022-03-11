// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import clientPromise from '../../lib/mongodb'

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = await client.db();
  // this line is pretty gross but it's just meant to be an example
  const testResult = (await db.collection('scores').find({}).toArray())[0];

  res.status(200).json({ name: testResult.name })
}
