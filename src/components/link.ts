import {Store, combine, createEvent, sample} from 'effector'
import {h, spec} from 'forest'
import {$basepath, goTo} from '../model'
import {Spec} from '../types'

export function RouterLink(config: Spec) {
  let href: string | Store<string>
  let trigger = createEvent<MouseEvent>()

  if (typeof config.to === 'string') {
    const to = config.to

    href = $basepath.map((basepath) => {
      const href = basepath ? basepath + to : to

      return href.length > 1 ? href.replace(/\/$/, '') : href
    })

    trigger = goTo.prepend<MouseEvent>(() => to)
  } else {
    href = combine($basepath, config.to, (basepath, to) => {
      const href = basepath + to

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
