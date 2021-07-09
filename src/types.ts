import {spec} from 'forest'

export type Keys = {name: string}[]
export type RouteCache = {[key: string]: MatchedPath}
export type MatchPathParams = {pathname: string; path: string}
export type MatchedPath = {
  path: string
  params: Params
} | null
export type Params = {[key: string]: string}
export type MatchRouteParams = {routes: RoutesRecord; pathname: string}
export type Routes = Route[]
export type Route = {
  path: string
  fn: (props?: MatchedPath) => void
  children?: Routes
}
export type CurrentRoute = {
  path: string
  params: Params
}
export type RouterParams = {
  context?: string
  routes: Routes
  notFoundView?: () => void
  startPath: Route['path']
}
export type Router = () => void
export type Spec = Parameters<typeof spec>[0] & {fn?: Callback; to: Route['path']}
export type Callback = () => void
export type RoutesRecord = Record<Route['path'], Route['fn']>
