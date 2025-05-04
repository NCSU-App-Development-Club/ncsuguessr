import { MiddlewareHandler } from 'hono'
import { generateHttpExceptionMessage } from '../util'
import { HTTPException } from 'hono/http-exception'
import { Bindings } from '../config'

export const adminTokenAuth = (): MiddlewareHandler<{ Bindings: Bindings }> => {
  return async (ctx, next) => {
    const authHeader = ctx.req.header('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HTTPException(401, {
        message: generateHttpExceptionMessage(
          'missing or invalid authorization header'
        ),
      })
    }

    const token = authHeader.slice(7).trim()

    if (!token) {
      throw new HTTPException(401, {
        message: generateHttpExceptionMessage('missing authorization'),
      })
    }

    if (token !== ctx.env.ADMIN_TOKEN) {
      throw new HTTPException(401, {
        message: generateHttpExceptionMessage('invalid authorization'),
      })
    }

    await next()
  }
}
