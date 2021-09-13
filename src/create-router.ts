import {variant} from 'forest'
import {flatMap} from './lib/flat-map'
import {$currentRoute, addRoutes, changeBasepath, NOT_FOUND_PATH, popState} from './model'
import {RouterParams, Router} from './types'

export function createRouter({routes, basepath, context}: RouterParams): Router {
  basepath = context ?? basepath
  if (!Array.isArray(routes)) throw Error('routes should be an Array of Route!')
  if (basepath && !basepath.match(/^\//)) throw Error('basepath should start with /')
  if (basepath && basepath.match(/^\/$/)) throw Error('basepath should not be only /')
  if (basepath) changeBasepath(basepath)

  const _routes = basepath
    ? flatMap(
        routes.map((route) => ({...route, path: `${basepath}${route.path}`.replace(/\/$/, '')})),
      )
    : flatMap(routes)

  addRoutes(_routes)

  window.addEventListener('popstate', (e) => popState((e.target as Window).location.pathname))

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
