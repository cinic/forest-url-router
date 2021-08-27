import {Store, combine, createEvent, sample} from 'effector'
import {h, spec} from 'forest'
import {$context, goTo} from '../model'
import {Spec} from '../types'

export function RouterLink(config: Spec) {
  let href: string | Store<string>
  let trigger = createEvent<MouseEvent>()

  if (typeof config.to === 'string') {
    const to = config.to

    href = $context.map((context) => {
      const href = (context + config.to).replace('//', '/')

      return href.length > 1 ? href.replace(/\/$/, '') : href
    })

    trigger = goTo.prepend<MouseEvent>(() => to)
  } else {
    href = combine($context, config.to, (context, to) => {
      const href = (context + to).replace('//', '/')

      return href.length > 1 ? href.replace(/\/$/, '') : href
    })

    sample({
      clock: trigger,
      source: config.to,
      target: goTo,
    })
  }

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
