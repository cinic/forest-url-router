import {createEvent, createEffect, restore, createStore, combine, attach} from 'effector'
import {pathToRegexp, Key} from 'path-to-regexp'
import {
  Keys,
  MatchedPath,
  MatchPathParams,
  MatchRouteParams,
  Params,
  RouteCache,
  RoutesRecord,
} from './types'

export const NOT_FOUND_PATH = '__'
export const routeCache: RouteCache = {}
export const emptyRoute = {path: NOT_FOUND_PATH, params: {}}

export const changeContext = createEvent<string>()
export const popState = createEvent<string>()
export const addRoutes = createEvent<RoutesRecord>('Add routes')

export const pushState = createEffect(
  ({pathname, params, path}: {pathname: string; params: Params; path: string}) => {
    if (location.pathname !== pathname) history.pushState({params, path}, '', pathname)
  },
)

const $routes = restore(addRoutes, {})
const $currentPathname = createStore('/')
export const $context = restore(changeContext, '/')
export const $currentRoute = combine(
  $currentPathname,
  $routes,
  (pathname, routes) => routeByPathname({pathname, routes}) || emptyRoute,
)

export const goTo = attach({
  effect: pushState,
  source: {context: $context, routes: $routes},
  mapParams: (pathnameWithoutContext: keyof RoutesRecord, {routes, context}) => {
    const {params, path} = routeByPathname({pathname: pathnameWithoutContext, routes}) || emptyRoute
    const pathname = `${context}${pathnameWithoutContext}`.replace('//', '/')

    return {context, params, pathname, path}
  },
})

$currentPathname.on([popState, goTo], (_, path) => path)

function routeByPathname({pathname, routes}: MatchRouteParams) {
  if (routeCache[pathname]) {
    return routeCache[pathname]
  }

  let route: MatchedPath = null

  for (const path in routes) {
    route = paramsByPathname({pathname, path})

    if (route) {
      routeCache[pathname] = route
      break
    }
  }

  return route
}

function paramsByPathname({pathname, path}: MatchPathParams): MatchedPath {
  if (!path && path !== '') {
    return null
  }

  const keys: Keys = []
  const match = pathToRegexp(path, keys as Key[], {end: true}).exec(pathname)

  if (match) {
    const [, ...values] = match

    return {
      path,
      params: keys.reduce((memo, key, index) => ({...memo, [key.name]: values[index]}), {}),
    }
  }

  return null
}
