import {createEffect, createEvent, createStore, attach, combine} from 'effector'
import {h, spec, variant} from 'forest'
import {pathToRegexp, Key} from 'path-to-regexp'
import {RouterParams, Router, Spec, Routes} from './index.d'

const NOT_FOUND_PATH = '__'
const routeCache: RouteCache = {}
const emptyRoute = {path: NOT_FOUND_PATH, params: {}}

export function createURLRouter({
  context = '',
  routes = [],
  notFoundView = () => void 0,
  startPath = '/',
}: RouterParams): Router {
  if (!Array.isArray(routes)) throw Error('routes should be an Array of Route!')
  if (context && !context.match(/^\//)) context = `/${context}`

  const popState = createEvent<string>()

  const pushState = createEffect(
    ({pathname, params, path}: {pathname: string; params: Params; path: string}) => {
      if (location.pathname !== pathname) history.pushState({params, path}, '', pathname)
    },
  )

  const $routes = createStore(routes)
  const $currentPathname = createStore(startPath)
  const $currentRoute = combine(
    $currentPathname,
    $routes,
    (pathname, routes) => routeByPathname({pathname, routes}) || emptyRoute,
  )

  const goTo = attach({
    effect: pushState,
    source: {routes: $routes},
    mapParams: (pathnameWithoutContext: string, {routes}) => {
      const {params, path} =
        routeByPathname({pathname: pathnameWithoutContext, routes}) || emptyRoute
      const pathname = `${context}${pathnameWithoutContext}`

      return {context, params, pathname, path}
    },
  })

  $currentPathname.on([popState, goTo], (_, path) => path)

  window.addEventListener('popstate', (e) =>
    popState((e.target as Window).location.pathname.replace(context, '')),
  )

  const Router = () =>
    variant({
      source: $currentRoute,
      key: 'path',
      cases: routes.reduce((memo, curr) => ({...memo, [curr.path]: curr.view}), {
        [NOT_FOUND_PATH]: notFoundView,
      }),
    })

  const Link = (config: Spec) => {
    if (!config.to) throw Error('Attr "to" should be a path of Route!')

    h('a', () => {
      const href = `${context}${config.to}`
      spec(config)
      spec({
        attr: {
          href: href.length > 1 ? href.replace(/\/$/, '') : href,
        },
        handler: {
          config: {
            prevent: true,
          },
          on: {
            click: goTo.prepend(() => config.to),
          },
        },
      })

      typeof config.fn === 'function' && config.fn()
    })
  }

  return {
    Router,
    Link,
    goTo,
    context,
    $currentPathname,
    $currentRoute,
  }
}

function routeByPathname({pathname, routes}: MatchRouteParams) {
  if (routeCache[pathname]) {
    return routeCache[pathname]
  }

  let route: MatchedPath = null

  for (const {path} of routes) {
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

type Keys = {name: string}[]
type RouteCache = {[key: string]: MatchedPath}
type MatchPathParams = {pathname: string; path: string}
type MatchedPath = {
  path: string
  params: Params
} | null
type Params = {[key: string]: string}
type MatchRouteParams = {routes: Routes; pathname: string}
