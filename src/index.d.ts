import {Effect, Event, Store} from 'effector'
import {PropertyMap, DOMProperty, AttributeStoreInput, StylePropertyMap, HandlerMap, spec} from 'forest'

export type RouterParams = {
  context?: string
  routes: Routes
  notFoundView?: () => void
  startPath: Route['path']
}
export type Route = {
  path: string
  view: (props?: any) => void
}
export type CurrentRoute = Store<{
  path: string
  params: {
    [x: string]: string
  }
}>
export type Routes = Route[]
export type Callback = () => void
export type Spec = Parameters<typeof spec>[0] & {fn?: Callback, to: Route['path']}
export type Router = () => void
export function createURLRouter({context: baseURL, routes}: RouterParams): Router
export const Link: (config: Spec) => void
export const goTo: Effect<string, void, Error>
export const $currentRoute: Store<{
  path: string
  params: {[key: string]: string}
}>
