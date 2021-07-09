import {h, spec} from 'forest'
import {$context, goTo} from '../model'
import {Spec} from '../types'

export function RouterLink(config: Spec) {
  const href = $context.map((context) => {
    const href = (context + config.to).replace('//', '/')

    return href.length > 1 ? href.replace(/\/$/, '') : href
  })
  const trigger = goTo.prepend<MouseEvent>(() => config.to)

  h('a', () => {
    spec(config)
    spec({
      attr: {href},
      handler: {
        config: {prevent: true},
        on: {click: trigger},
      },
    })

    typeof config.fn === 'function' && config.fn()
  })
}

/**
 * @deprecated
 */
export const Link = RouterLink
