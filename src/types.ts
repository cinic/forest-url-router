import {spec} from 'forest'
import {Store, Effect} from 'effector'

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
export type RouterParams = {
  context?: string
  routes: Routes
}
export type Router = () => void
export type Spec = Parameters<typeof spec>[0] & {fn?: Callback; to: Route['path']}
type Callback = () => void
export type RoutesRecord = Record<Route['path'], Route['fn']>

export declare function createURLRouter(config: {context?: string; routes: Routes}): () => void
export declare function createRouter(config: {context?: string; routes: Routes}): () => void
export declare function RouterLink(config: Spec): void
export declare function Link(config: Spec): void
export declare function Redirect({to}: {to: string}): void
export declare const goTo: Effect<keyof RoutesRecord, void, Error>
export declare const $currentRoute: Store<{
  path: string
  params: Params
}>
