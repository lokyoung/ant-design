import PropTypes from '../_util/vue-types'
import { cloneElement } from '../_util/vnode'
import classNames from 'classnames'
import { SpinProps } from '../spin'
import LocaleReceiver from '../locale-provider/LocaleReceiver'
import defaultLocale from '../locale-provider/default'
import { initDefaultProps } from '../_util/props-util'

import Spin from '../spin'
import Pagination from '../pagination'
import { Row } from '../grid'

import Item from './Item'

export { ListItemProps, ListItemMetaProps } from './Item'

export const ColumnCount = [1, 2, 3, 4, 6, 8, 12, 24]

export const ColumnType = ['gutter', 'column', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl']

export const ListGridType = () => ({
  gutter: PropTypes.number,
  column: PropTypes.oneOf(ColumnCount),
  xs: PropTypes.oneOf(ColumnCount),
  sm: PropTypes.oneOf(ColumnCount),
  md: PropTypes.oneOf(ColumnCount),
  lg: PropTypes.oneOf(ColumnCount),
  xl: PropTypes.oneOf(ColumnCount),
  xxl: PropTypes.oneOf(ColumnCount),
})

export const ListSize = ['small', 'default', 'large']

export const ListProps = {
  bordered: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.any,
  dataSource: PropTypes.any,
  extra: PropTypes.any,
  grid: ListGridType,
  id: PropTypes.string,
  itemLayout: PropTypes.string,
  loading: PropTypes.boolean,
  loadMore: PropTypes.any,
  prefixCls: PropTypes.string,
  rowKey: PropTypes.any,
  renderItem: PropTypes.any,
  size: PropTypes.oneOf(ListSize),
  split: PropTypes.bool,
  header: PropTypes.any,
  footer: PropTypes.any,
  locale: Object,
}

export const ListLocale = () => ({
  emptyText: PropTypes.string,
})

export default {
  name: 'AList',
  props: initDefaultProps(ListProps, {
    dataSource: [],
    prefixCls: 'ant-list',
    bordered: false,
    split: true,
    // loading: false,
  }),
  // static Item: typeof Item = Item;

  // static childContextTypes = {
  //   grid: PropTypes.any,
  // };

  // state = {
  //   paginationCurrent: 1,
  // };
  data () {
    return {
      current: 1,
      pageSize: 10,
      total: 0,
    }
  },
  // private keys: { [key: string]: string } = {};

  // getChildContext() {
  //   return {
  //     grid: this.props.grid,
  //   };
  // }

  methods: {
    renderItem (item, index) {
      const { dataSource, renderItem, rowKey } = this.props
      let key

      if (typeof rowKey === 'function') {
        key = rowKey(dataSource[index])
      } else if (typeof rowKey === 'string') {
        key = dataSource[rowKey]
      } else {
        key = dataSource.key
      }

      if (!key) {
        key = `list-item-${index}`
      }

      this.keys[index] = key

      return renderItem(item, index)
    },
    isSomethingAfterLastItem () {
      const { loadMore, pagination, footer } = this.props
      return !!(loadMore || pagination || footer)
    },
    renderEmpty (contextLocale) {
      const locale = { ...contextLocale, ...this.props.locale }
      return (
        <div className={`${this.props.prefixCls}-empty-text`}>
          {locale.emptyText}
        </div>
      )
    },
    onPageChange (page, pageSize) {
      const { pagination } = this.props
      if (pagination && pagination.onChange) {
        pagination.onChange(page, pageSize)
      }
    },
  },
  render () {
    const { paginationCurrent } = this.state
    const {
      $slots,
      bordered,
      split,
      className,
      children,
      itemLayout,
      loadMore,
      pagination,
      prefixCls,
      grid,
      dataSource,
      size,
      header,
      footer,
      loading,
      ...rest
    } = this.props

    let loadingProp = loading
    if (typeof loadingProp === 'boolean') {
      loadingProp = {
        spinning: loadingProp,
      }
    }
    const isLoading = loadingProp && loadingProp.spinning

    // large => lg
    // small => sm
    let sizeCls = ''
    switch (size) {
      case 'large':
        sizeCls = 'lg'
        break
      case 'small':
        sizeCls = 'sm'
        break
      default:
        break
    }

    const classString = classNames(prefixCls, className, {
      [`${prefixCls}-vertical`]: itemLayout === 'vertical',
      [`${prefixCls}-${sizeCls}`]: sizeCls,
      [`${prefixCls}-split`]: split,
      [`${prefixCls}-bordered`]: bordered,
      [`${prefixCls}-loading`]: isLoading,
      [`${prefixCls}-grid`]: grid,
      [`${prefixCls}-something-after-last-item`]: this.isSomethingAfterLastItem(),
    })

    const paginationProps = {
      ...this.defaultPaginationProps,
      total: dataSource.length,
      current: paginationCurrent,
      ...pagination || {},
    }

    const largestPage = Math.ceil(
      paginationProps.total / paginationProps.pageSize,
    )
    if (paginationProps.current > largestPage) {
      paginationProps.current = largestPage
    }
    const paginationContent = pagination ? (
      <div className={`${prefixCls}-pagination`}>
        <Pagination
          {...paginationProps}
          onChange={this.onPageChange}
        />
      </div>
    ) : null

    let splitDataSource = [...dataSource]
    if (pagination) {
      if (
        dataSource.length >
        (paginationProps.current - 1) * paginationProps.pageSize
      ) {
        splitDataSource = [...dataSource].splice(
          (paginationProps.current - 1) * paginationProps.pageSize,
          paginationProps.pageSize,
        )
      }
    }

    let childrenContent
    childrenContent = isLoading && <div style={{ minHeight: 53 }} />
    if (splitDataSource.length > 0) {
      const items = splitDataSource.map((item, index) =>
        this.renderItem(item, index),
      )
      const childrenList = $slots.default.map((element, index) => {
        cloneElement(children, {
          key: this.keys[index],
        })
      })

      childrenContent = grid ? (
        <Row gutter={grid.gutter}>{childrenList}</Row>
      ) : (
        childrenList
      )
    } else if (!children && !isLoading) {
      childrenContent = (
        <LocaleReceiver
          componentName='Table'
          defaultLocale={defaultLocale.Table}
        >
          {this.renderEmpty}
        </LocaleReceiver>
      )
    }

    const paginationPosition = paginationProps.position || 'bottom'

    return (
      <div className={classString} {...rest}>
        {(paginationPosition === 'top' || paginationPosition === 'both') && paginationContent}
        {header && <div className={`${prefixCls}-header`}>{header}</div>}
        <Spin {...loadingProp}>
          {childrenContent}
          {children}
        </Spin>
        {footer && <div className={`${prefixCls}-footer`}>{footer}</div>}
        {loadMore || (paginationPosition === 'bottom' || paginationPosition === 'both') && paginationContent}
      </div>
    )
  },
}
