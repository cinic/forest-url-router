import {goTo} from '../model'

export function Redirect({to}: {to: string}) {
  goTo(to)
}
