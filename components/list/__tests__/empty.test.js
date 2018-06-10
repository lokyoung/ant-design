import { mount } from '@vue/test-utils'
import List from '..'

describe('List', () => {
  it('renders empty list', () => {
    const list = mount({
      render () {
        return <List dataSource={[]} renderItem={() => <List.Item />} />
      },
    })
    expect(list.findAll('.ant-card-multiple-words').length).toBe(0)
  })
})
