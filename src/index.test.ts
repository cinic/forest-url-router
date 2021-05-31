import {createURLRouter, $context} from './index'

describe('Test router creation', () => {
  it('context without /', () => {
    createURLRouter({
      context: 'dealer',
      routes: [{path: '/', view: () => console.log('Hello')}],
    })
    expect($context.getState()).toBe('/dealer')
  })
})