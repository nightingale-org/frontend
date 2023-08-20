import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  let ip = '';
  const forwarded_for = req.headers['x-forwarded-for'];
  if (forwarded_for && typeof forwarded_for === 'string') {
    ip = forwarded_for.split(',')[0];
  }

  if (req.headers.host) {
    const proto = req.headers['x-forwarded-proto'] ?? 'https';
    ip = `${proto}://${req.headers.host}`;
  }

  if (!ip) {
    return res.status(400).end();
  }

  const indexPageUrl = encodeURI(ip);
  return res.redirect(
    `${process.env.AUTH0_DOMAIN}/v2/logout?client_id=${process.env.AUTH0_CLIENT_ID}&returnTo=${indexPageUrl}`
  );
}
