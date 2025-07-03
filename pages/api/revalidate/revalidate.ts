// pages/api/revalidate.ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    const { type, id, secret } = req.body;

    if (secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Invalid secret token' });
    }

    try {
    if (type === 'list') {
        await res.revalidate('/notes');
    } else if (type === 'single' && id) {
        await res.revalidate(`/notes/${id}`);
    } else {
        return res.status(400).json({ message: 'Missing or invalid type/id' });
    }

    return res.json({ revalidated: true });
    } catch (err) {
    return res.status(500).json({ message: 'Error revalidating', error: err });
    }
}
