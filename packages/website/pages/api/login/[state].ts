import type { NextApiRequest, NextApiResponse } from 'next'

function isValid(state: unknown): state is string {
  return typeof state === 'string' && state !== ''
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { FIGMA_APP_CLIENT_ID, FIGMA_APP_REDIRECT_URI } = process.env
  const state = req.query.state

  if (!isValid(state)) {
    return res.status(443).json({ message: 'Access denied!' })
  }

  res.setHeader('Set-Cookie', `state=${state}; Path=/api/oauth`)
  res.redirect(307, `https://www.figma.com/oauth?client_id=${FIGMA_APP_CLIENT_ID}&redirect_uri=${FIGMA_APP_REDIRECT_URI}&scope=file_read&state=${state}&response_type=code`)
}
