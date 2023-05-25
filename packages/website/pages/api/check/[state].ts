import type { NextApiRequest, NextApiResponse } from 'next'
import { getItem, removeItem } from '../../../lib/auth-storage'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (typeof req.query.state !== 'string') {
    return res.status(404).send('')
  }

  console.log('invoked', req.query.state)

  const auth = getItem(req.query.state)

  if (auth == null) {
    return res.status(404).send('')
  }

  removeItem(req.query.state)
  res.status(200).json(auth)
}
