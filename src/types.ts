export type RouterParams = {
  baseURL: string
  routes: Routes
}
export type Route = {
  path: string
  exact?: boolean
  component: () => void
}
export type Routes = Route[]
