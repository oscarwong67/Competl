import { getStatsForUserId } from '../../../lib/users';

export default async function handler(req, res) {
    const { userId } = req.query;
    const stats = await getStatsForUserId(userId);

    res.status(200).json(stats);
}  