import { FastifyReply, FastifyRequest } from 'fastify'

export async function refreshToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  await request.jwtVerify({ onlyCookie: true })

  const accessToken = await reply.jwtSign(
    {},
    {
      sign: {
        sub: request.user.sub,
      },
    },
  )

  const refreshToken = await reply.jwtSign(
    {},
    {
      sign: {
        sub: request.user.sub,
        expiresIn: '7d',
      },
    },
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true, // Encriptado através do HTTPS
      sameSite: true, // Só é acessível dentro do mesmo domínio,
      httpOnly: true, // Só é acessível pelo back-end
    })
    .status(200)
    .send({ accessToken })
}
