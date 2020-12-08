import {Store, Event} from 'effector'
import {spec} from 'forest'

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
export type MatchedParams = {[key in string | number]: string}
type Spec = Parameters<typeof spec>
interface Router {
  $currentRoute: Store<
    | {
        path: string
        url: string
        isExact: boolean
        params: MatchedParams
      }
    | {
        path: string
      }
  >
  $currentPath: Store<string>
  push: Event<string>
  Link: (config?: Spec) => void
  Router(config?: MatchedParams): void
}

export function createURLRouter(config: RouterParams): Router
