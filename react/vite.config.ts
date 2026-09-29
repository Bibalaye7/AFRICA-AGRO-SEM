import { defineConfig, loadEnv, type Plugin } from 'vite'

// En local, Vite sert aussi l'API (/api/*) avec le même code que la fonction Vercel.
function localApi(): Plugin {
  return {
    name: 'africa-agro-sem-api',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res) => {
        const { handleApi } = await server.ssrLoadModule('/server/app.ts')
        const route = new URL(req.url ?? '/', 'http://localhost').pathname
        await handleApi(req, res, route)
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  // Rend DATABASE_URL, DATABASE_AUTH_TOKEN et SESSION_SECRET de .env.local visibles par le serveur local.
  // Les variables déjà définies dans l'environnement restent prioritaires.
  const env = loadEnv(mode, process.cwd(), '')
  for (const key of ['DATABASE_URL', 'DATABASE_AUTH_TOKEN', 'SESSION_SECRET']) {
    if (env[key] && !process.env[key]) process.env[key] = env[key]
  }
  return { plugins: [localApi()] }
})
