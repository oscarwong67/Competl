import { getStatsForUserId } from '../../../lib/users';

export default async function handler(req, res) {
    const { userId } = req.query;
    console.log("Getting Stats for " + userId);
    const stats = await getStatsForUserId(userId);

    res.status(200).json(stats);
}  