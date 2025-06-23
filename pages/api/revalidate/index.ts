// pages/api/revalidate-notes.ts

import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  revalidate: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
let revalidated = false;
console.log('Revalidating notes page...');

try {
  await res.revalidate('/notes');
  revalidated = true;
} catch (err) {
  /*console.error('Error revalidating notes page:', err);
  return res.status(500).json({ revalidate: false });*/
}

res.json({ revalidate: revalidated });}

/*export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log('Revalidate notes page...');

  const { query: { secret } } = req;

  if (secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ revalidate: false });
  }

  try {
    await res.revalidate('/notes');
    return res.json({ revalidate: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ revalidate: false });
  }
}*/
