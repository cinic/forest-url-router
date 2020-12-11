import {Event, Store} from 'effector'
import {PropertyMap, DOMProperty, AttributeStoreInput, StylePropertyMap, HandlerMap} from 'forest'

export type RouterParams = {
  baseURL?: string
  routes: Routes
}
export type Route = {
  path: string
  exact?: boolean
  component: () => void
}
export type Routes = Route[]
export type Spec = {
  attr?: PropertyMap
  data?: PropertyMap
  text?: DOMProperty | AttributeStoreInput | Array<DOMProperty | AttributeStoreInput>
  visible?: Store<boolean>
  style?: StylePropertyMap
  styleVar?: PropertyMap
  handler?: HandlerMap
  fn?: () => void
}
export type Router = {
  $currentRoute: Store<
    | {
        path: string
        url: string
        isExact: boolean
        params: {
          [x: string]: string
        }
      }
    | {
        path: string
      }
  >
  $currentPath: Store<string>
  push: Event<string>
  Link: (config?: Spec) => void
  Router: () => void
}
export function createURLRouter({baseURL, routes}: RouterParams): Router
