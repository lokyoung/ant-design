---
order: 4
title:
  zh-CN: 栅格列表
  en-US: Grid
---

## zh-CN

可以通过设置 `List` 的 `grid` 属性来实现栅格列表，`column` 可设置期望显示的列数。

## en-US

Creating a grid list by setting the `grid` property of List

```html
<a-list
  :grid="{{ gutter: 16, column: 4 }}"
  :dataSource="data"
  @renderItem="renderItem">
</a-list>

<script>
export default {
  data() {
    return {
      data: [
        {
          title: 'Title 1',
        },
        {
          title: 'Title 2',
        },
        {
          title: 'Title 3',
        },
        {
          title: 'Title 4',
        },
      ]
    }
  },
  methods: {
    renderItem(item) {
      return (
        <List.Item>
          <Card title={item.title}>Card content</Card>
        </List.Item>
      )
    }
  }
}
</script>
```
