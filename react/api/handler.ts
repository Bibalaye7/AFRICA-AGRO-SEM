// Fonction Vercel : toutes les requêtes /api/* y sont redirigées (voir vercel.json).
import type { IncomingMessage, ServerResponse } from 'node:http'
import { handleApi } from '../server/app.js'

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const route = new URL(req.url ?? '/', 'http://localhost').searchParams.get('route') ?? ''
  await handleApi(req, res, route)
}
