import {h, spec, variant} from 'forest'
import {flatMap} from './lib/flat-map'
import {
  $context,
  $currentRoute,
  addRoutes,
  changeContext,
  goTo,
  NOT_FOUND_PATH,
  popState,
} from './model'
import {RouterParams, Router, Spec} from './types'

export function createURLRouter({
  context = '',
  routes,
  notFoundView = () => void 0,
  startPath = '/',
}: RouterParams): Router {
  if (!Array.isArray(routes)) throw Error('routes should be an Array of Route!')
  if (context && !context.match(/^\//)) context = `/${context}`
  const _routes = flatMap(routes)
  changeContext(context)
  addRoutes(_routes)
  popState(startPath)

  window.addEventListener('popstate', (e) =>
    popState((e.target as Window).location.pathname.replace(context, '')),
  )

  return () =>
    variant({
      source: $currentRoute,
      key: 'path',
      cases: {
        [NOT_FOUND_PATH]: notFoundView,
        ..._routes,
      },
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
