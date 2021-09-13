import {createEvent} from 'effector'
import {createRouter} from './create-router'
import {$basepath, $currentRoute, $routes, $currentPathname, goTo} from './model'

const reset = createEvent()

beforeAll(() => {
  $currentPathname.reset(reset)
  $routes.reset(reset)
  $basepath.reset(reset)
})

afterAll(() => {
  $currentPathname.off(reset)
  $routes.off(reset)
  $basepath.off(reset)
})

describe('Test router creation', () => {
  it('context without /', () => {
    reset()
    const router = () =>
      createRouter({
        basepath: 'dealer',
        routes: [{path: '/', fn: console.log}],
      })

    expect(() => router()).toThrowError('basepath should start with /')
  })

  it('basepath /dealer', () => {
    reset()
    createRouter({
      basepath: '/dealer',
      routes: [{path: '/', fn: console.log}],
    })

    expect($basepath.getState()).toBe('/dealer')
  })

  it('goTo / with basepath /dealer', async () => {
    reset()
    createRouter({
      basepath: '/dealer',
      routes: [{path: '/', fn: console.log}],
    })

    await goTo('/')

    expect($currentRoute.getState()).toStrictEqual({path: '/dealer', params: {}})
  })

  it('goTo basepath', async () => {
    reset()
    createRouter({
      basepath: '/dealer',
      routes: [{path: '/', fn: console.log}],
    })

    await goTo('/dealer')

    expect($currentRoute.getState().path).toBe('/dealer')
  })

  it('goTo / with basepath /', async () => {
    reset()
    createRouter({
      basepath: '/',
      routes: [{path: '/', fn: console.log}],
    })

    await goTo('/')

    expect($currentRoute.getState().path).toBe('/')
  })
})
