import {variant} from 'forest'
import {flatMap} from './lib/flat-map'
import {$currentRoute, addRoutes, changeBasepath, NOT_FOUND_PATH, popState} from './model'
import {RouterParams, Router} from './types'

export function createRouter({routes, basepath = null}: RouterParams): Router {
  if (!Array.isArray(routes)) throw Error('routes should be an Array of Route!')
  if (basepath && !basepath.match(/^\//)) throw Error('basepath should start with /')
  if (basepath && basepath.match(/^\/$/)) basepath = null
  if (basepath) changeBasepath(basepath)

  const _routes = basepath
    ? flatMap(
        routes.map((route) => {
          const path = `${basepath}${route.path}`.replace(/\/$/, '')

          return {...route, path}
        }),
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
