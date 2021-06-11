import {createEffect, createEvent, createStore, restore, attach, combine} from 'effector'
import {h, spec, variant} from 'forest'
import {pathToRegexp, Key} from 'path-to-regexp'
import {RouterParams, Router, Spec, Routes} from './index.d'

const NOT_FOUND_PATH = '__'
const routeCache: RouteCache = {}
const emptyRoute = {path: NOT_FOUND_PATH, params: {}}

const changeContext = createEvent<string>()
const popState = createEvent<string>()
const addRoutes = createEvent<Routes>('Add routes')

const pushState = createEffect(
  ({pathname, params, path}: {pathname: string; params: Params; path: string}) => {
    if (location.pathname !== pathname) history.pushState({params, path}, '', pathname)
  },
)

const $routes = restore(addRoutes, [])
const $currentPathname = createStore('/')
export const $context = restore(changeContext, '')
export const $currentRoute = combine(
  $currentPathname,
  $routes,
  (pathname, routes) => routeByPathname({pathname, routes}) || emptyRoute,
)

export const goTo = attach({
  effect: pushState,
  source: {context: $context, routes: $routes},
  mapParams: (pathnameWithoutContext: string, {routes, context}) => {
    const {params, path} = routeByPathname({pathname: pathnameWithoutContext, routes}) || emptyRoute
    const pathname = `${context}${pathnameWithoutContext}`

    return {context, params, pathname, path}
  },
})

$currentPathname.on([popState, goTo], (_, path) => path)

export function createURLRouter({
  context = '',
  routes,
  notFoundView = () => void 0,
  startPath = '/',
}: RouterParams): Router {
  if (!Array.isArray(routes)) throw Error('routes should be an Array of Route!')
  if (context && !context.match(/^\//)) context = `/${context}`

  changeContext(context)
  addRoutes(routes)
  popState(startPath)

  window.addEventListener('popstate', (e) =>
    popState((e.target as Window).location.pathname.replace(context, '')),
  )

  return () =>
    variant({
      source: $currentRoute,
      key: 'path',
      cases: routes.reduce((memo, curr) => ({...memo, [curr.path]: curr.view}), {
        [NOT_FOUND_PATH]: notFoundView,
      }),
    })
}

export const Link = (config: Spec) =>
  h('a', () => {
    spec(config)
    spec({
      attr: {
        href: $context.map((context) => {
          const href = `${context}${config.to}`

          return href.length > 1 ? href.replace(/\/$/, '') : href
        }),
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
