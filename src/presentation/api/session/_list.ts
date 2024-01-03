import type { RouteHandlerListItem } from '../initRouting.js'
import { SignUpRouteHandler } from './sign-up.js'

export const _list: RouteHandlerListItem[] = [
  { handler: SignUpRouteHandler, path: 'session/sign-up' }
]
