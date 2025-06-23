import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  revalidate: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log('Revalidating detail page...');
  const { query: { id }} = req;

let revalidated = false;
try {
  await res.revalidate(`/notes/${id}`);
  revalidated = true;
} catch (err) {
  /*console.error('Error revalidating notes page:', err);
  return res.status(500).json({ revalidate: false });*/
}

res.json({ revalidate: revalidated });}










// pages/api/revalidate-detail.ts

/*import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  revalidate: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log('Revalidate detail page...');

  const { query: { id, secret } } = req;

  if (secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ revalidate: false });
  }

  if (typeof id !== 'string') {
    return res.status(400).json({ revalidate: false });
  }

  try {
    await res.revalidate(`/note/${id}`);
    return res.json({ revalidate: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ revalidate: false });
  }
}
*/

// pages/api/revalidate-detail.ts
/*import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.query.secret !== process.env.NEXT_PUBLIC_REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Invalid secret' });
  }

  const id = req.query.id as string;
  if (!id) {
    return res.status(400).json({ message: 'Missing id' });
  }

  try {
    await res.revalidate(`/note/${id}`);
    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).send('Error revalidating');
  }
}*/
