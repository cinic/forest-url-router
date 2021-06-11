import {createURLRouter} from './index'

describe('Test router creation', () => {
  it('context without /', () => {
    const {context} = createURLRouter({
      context: 'dealer',
      routes: [{path: '/', view: () => console.log('Hello')}],
      startPath: '/',
    })
    expect(context).toBe('/dealer')
  })
  it('empty context', () => {
    const {context} = createURLRouter({
      context: '',
      routes: [{path: '/', view: () => console.log('Hello')}],
      startPath: '/',
    })
    expect(context).toBe('')
  })
})
