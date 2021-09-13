import {createRouter} from './create-router'
import {$basepath, $currentRoute, goTo} from './model'

describe('Test router creation', () => {
  it('context without /', () => {
    const router = () =>
      createRouter({
        basepath: 'dealer',
        routes: [{path: '/', fn: console.log}],
      })

    expect(router).toThrowError('basepath should start with /')
  })

  it('basepath /dealer', () => {
    createRouter({
      basepath: '/dealer',
      routes: [{path: '/', fn: console.log}],
    })

    expect($basepath.getState()).toBe('/dealer')
  })

  it('goTo / with basepath /dealer', () => {
    createRouter({
      basepath: '/dealer',
      routes: [{path: '/', fn: console.log}],
    })

    goTo('/')

    expect($currentRoute.getState()).toStrictEqual({path: '/dealer', params: {}})
  })

  it('goTo basepath', () => {
    createRouter({
      basepath: '/dealer',
      routes: [{path: '/', fn: console.log}],
    })

    goTo('/dealer')

    expect($currentRoute.getState().path).toBe('/dealer')
  })
})
