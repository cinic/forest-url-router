import {createRouter} from './create-router'
import {$context} from './model'

describe('Test router creation', () => {
  it('context without /', () => {
    createRouter({
      context: 'dealer',
      routes: [{path: '/', fn: console.log}],
    })
    expect($context.getState()).toBe('/dealer')
  })
  it('empty context', () => {
    createRouter({
      routes: [{path: '/', fn: console.log}],
    })
    expect($context.getState()).toBe('/')
  })
})
