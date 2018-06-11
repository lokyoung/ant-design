---
order: 1
title:
  zh-CN: 基础列表
  en-US: Basic list
---

## zh-CN

基础列表。

## en-US

Basic list.

```html
<template>
  <a-list
    :itemLayout="horizontal"
    :dataSource="data"
    @renderItem="renderItem">
  </a-list>
</template>

<script>
export default {
  data() {
    return {
      data: []
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
