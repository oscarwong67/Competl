import { updateUserName } from '../../../lib/users';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return;
  }
  const userId = req.body.userId;
  const username = req.body.username;
  await updateUserName(userId, username);
  res.status(200).json({ message: 'Username changed' });
}