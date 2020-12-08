import {createEffect, createEvent, createStore, forward, restore, Store} from 'effector'
import {
  h,
  spec,
  variant,
  PropertyMap,
  DOMProperty,
  AttributeStoreInput,
  StylePropertyMap,
  HandlerMap,
} from 'forest'
import {matchRoute} from './match-route'
import {RouterParams} from './types'

export function createURLRouter({baseURL = '', routes = []}: RouterParams) {
  const pathname = removeBaseURL(location.pathname, baseURL)
  const match = matchRoute({pathname, routes})

  const pop = createEvent<string>()
  const push = createEvent<string>()
  const pushState = createEffect({
    handler(value: string) {
      if (removeBaseURL(location.pathname, baseURL) !== value)
        history.pushState({}, '', `${baseURL}${value}`)
    },
  })
  const $baseURL = createStore(baseURL)
  const $currentRoute = createStore(match || {path: '__'})
  const $currentPath = restore(push, pathname).on(pop, (_, v) => v)

  forward({
    from: $currentPath.map((pathname) => matchRoute({pathname, routes}) || {path: '__'}),
    to: $currentRoute,
  })

  forward({
    from: push,
    to: pushState,
  })

  const Link = (config: Spec = {}) => {
    h('a', () => {
      spec({
        attr: {
          href: $baseURL.map((base) => `${base}${config.attr?.href}`),
        },
        text: config.text,
        handler: {
          click: push.prepend((e) => {
            e.preventDefault()
            return config.attr?.href as string
          }),
        },
      })
    })
  }

  const Router = () =>
    variant({
      source: $currentRoute,
      key: 'path',
      cases: routes.reduce((memo, curr) => {
        memo[curr.path] = curr.component
        return memo
      }, {} as {[key: string]: () => void; __: () => void}),
    })

  window.addEventListener('popstate', (e) =>
    pop(removeBaseURL((e.target as Window).location.pathname, baseURL)),
  )

  return {
    $currentRoute,
    $currentPath,
    push,
    Link,
    Router,
  }
}

function removeBaseURL(url: string, baseURL: string) {
  return url.replace(baseURL, '')
}

export type MatchedRoute = ReturnType<typeof matchRoute>

type Spec = {
  attr?: PropertyMap
  data?: PropertyMap
  text?: DOMProperty | AttributeStoreInput | Array<DOMProperty | AttributeStoreInput>
  visible?: Store<boolean>
  style?: StylePropertyMap
  styleVar?: PropertyMap
  handler?: HandlerMap
  fn?: () => void
}
