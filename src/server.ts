import { env } from '@infra/env'
import { app } from './app'

app.listen({ host: '0.0.0.0', port: env.PORT }).then(() => {
  console.log(`Server Running... 🚀`)
})

// app.server.address()
