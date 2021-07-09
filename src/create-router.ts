import {variant} from 'forest'
import {flatMap} from './lib/flat-map'
import {$currentRoute, addRoutes, changeContext, NOT_FOUND_PATH, popState} from './model'
import {RouterParams, Router} from './types'

export function createRouter({context = '/', routes, startPath = '/'}: RouterParams): Router {
  if (!Array.isArray(routes)) throw Error('routes should be an Array of Route!')
  if (context && !context.match(/^\//)) context = `/${context}`
  const _routes = flatMap(routes)
  changeContext(context)
  addRoutes(_routes)
  popState(startPath)

  window.addEventListener('popstate', (e) =>
    popState((e.target as Window).location.pathname.replace(context, '')),
  )

  return () =>
    variant({
      source: $currentRoute,
      key: 'path',
      cases: {
        [NOT_FOUND_PATH]: () => undefined,
        ..._routes,
      },
    })
}

/**
 * @deprecated
 */
export const createURLRouter = createRouter
