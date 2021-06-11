import {createURLRouter, $context} from './index'

describe('Test router creation', () => {
  it('context without /', () => {
    createURLRouter({
      context: 'dealer',
      routes: [{path: '/', view: () => console.log('Hello')}],
      startPath: '/',
    })
    expect($context.getState()).toBe('/dealer')
  })
  it('empty context', () => {
    createURLRouter({
      context: '',
      routes: [{path: '/', view: () => console.log('Hello')}],
      startPath: '/',
    })
    expect($context.getState()).toBe('')
  })
})
