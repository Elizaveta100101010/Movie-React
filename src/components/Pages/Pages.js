import React, { Component } from 'react'
import './Pages.css'
import { Pagination } from 'antd'

export default class Pages extends Component {
  render() {
    const { pages, onChangePage } = this.props

    return <Pagination className="pagination-list" size="small" total={pages} onChange={(num) => onChangePage(num)} />
  }
}
