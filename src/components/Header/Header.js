import React, { Component } from 'react'
import './Header.css'
import { Tabs } from 'antd'

export default class Header extends Component {
  render() {
    const items = [
      {
        key: '1',
        label: 'Search',
      },
      {
        key: '2',
        label: 'Rated',
      },
    ]
    return <Tabs defaultActiveKey="1" items={items} onChange={this.props.onChangeTab} />
  }
}
