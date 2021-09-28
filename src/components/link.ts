import {combine, createEvent, sample} from 'effector'
import {h, spec} from 'forest'
import {$basepath, goTo} from '../model'
import {Spec} from '../types'

export function RouterLink(config: Spec) {
  const trigger = createEvent<MouseEvent>()

  const href = combine({basepath: $basepath, to: config.to as string}, ({basepath, to}) => {
    const href = basepath ? basepath + to : to

    return href.length > 1 ? href.replace(/\/$/, '') : href
  })

  sample({
    clock: trigger,
    source: href,
    target: goTo,
  })

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
