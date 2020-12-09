import {createEffect, createEvent, createStore, forward, restore} from 'effector'
import {h, spec, variant} from 'forest'
import {matchRoute} from './match-route'
import {RouterParams, Router, Spec} from './index.d'

export function createURLRouter({baseURL = '', routes}: RouterParams): Router {
  if (!Array.isArray(routes)) throw Error('routes should be an Array of Route!')

  const pathname = removeBaseURL(location.pathname, baseURL)
  const pop = createEvent<string>()
  const push = createEvent<string>()
  const pushState = createEffect({
    handler(value: string) {
      if (removeBaseURL(location.pathname, baseURL) !== value)
        history.pushState({}, '', `${baseURL}${value}`)
    },
  })
  const $currentRoute = createStore(matchRoute({pathname, routes}) || {path: '__'})
  const $currentPath = restore(push, pathname).on(pop, (_, v) => v)

  forward({
    from: $currentPath.map((pathname) => matchRoute({pathname, routes}) || {path: '__'}),
    to: $currentRoute,
  })

  forward({
    from: push,
    to: pushState,
  })

  const Link = ({attr: _attr, text, handler, ...config}: Spec = {}) => {
    const attr = _attr?.href ? {..._attr, href: `${baseURL}${_attr.href}`} : _attr
    h('a', () => {
      spec({
        ...config,
        attr,
        text,
        handler: {
          ...handler,
          click: push.prepend((e) => {
            e.preventDefault()
            return attr?.href as string
          }),
        },
      })
    })
  }

  const Router = () =>
    variant({
      source: $currentRoute,
      key: 'path',
      cases: routes.reduce((memo, curr) => ({...memo, [curr.path]: curr.component}), {}),
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
