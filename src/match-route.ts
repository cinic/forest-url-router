import {pathToRegexp, Key, Path, TokensToRegexpOptions, ParseOptions} from 'path-to-regexp'
import {Routes} from './index.d'

const cache: PathCache = {}
const routeCache: RouteCache = {}

export function matchRoute({pathname, routes}: MatchRouteParams) {
  if (routeCache[pathname]) return routeCache[pathname]

  let match = null

  for (let i = 0; i < routes.length; i++) {
    match = matchPath({pathname, path: routes[i].path, exact: routes[i].exact})

    if (match) {
      routeCache[pathname] = match
      break
    }
  }

  return match
}

function matchPath({pathname, path, exact = false}: MatchPathParams): MatchedParams {
  if (!path && path !== '') return null
  const {regexp, keys} = compilePath(path, {end: exact})
  const match = regexp.exec(pathname)

  if (!match) return null

  const [url, ...values] = match
  const isExact = pathname === url

  if (exact && !isExact) return null

  return {
    path,
    url: path === '/' && url === '' ? '/' : url,
    isExact,
    params: keys.reduce(
      (memo, key, index) => ({...memo, [key.name.toString()]: values[index]}),
      {},
    ),
  }
}

function compilePath(path: Path, options: Options) {
  const cacheKey = `${path}`

  if (cache[cacheKey]) return cache[cacheKey]

  const keys: Key[] = []
  const regexp = pathToRegexp(path, keys, options)

  return (cache[cacheKey] = {regexp, keys})
}

type PathCache = {
  [key: string]: {regexp: RegExp; keys: Key[]}
}
type RouteCache = {[key: string]: ReturnType<typeof matchPath>}
type Options = TokensToRegexpOptions & ParseOptions
type MatchPathParams = {pathname: string; path: string; exact?: boolean}
type MatchedParams = {
  path: string
  url: string
  isExact: boolean
  params: {[key: string]: string}
} | null
type MatchRouteParams = {routes: Routes; pathname: string}
