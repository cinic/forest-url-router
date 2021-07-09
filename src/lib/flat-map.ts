import {Routes, Route, RoutesRecord} from '../types'

export function flatMap(
  routes: Routes,
  cases?: RoutesRecord,
  parentPath?: Route['path'],
): RoutesRecord {
  const _cases = cases || {}
  let childs = {}

  return routes.reduce((memo, route) => {
    const currentPath = parentPath ? parentPath + route.path : route.path
    memo[currentPath] = route.fn

    if (route.children) {
      childs = flatMap(route.children, _cases, currentPath)
    }

    return {...memo, ...childs}
  }, _cases)
}
