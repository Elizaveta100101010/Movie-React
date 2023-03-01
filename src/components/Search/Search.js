import React, { Component } from 'react'
import './Search.css'
import { Input } from 'antd'

export default class Search extends Component {
  state = {
    title: '',
  }
  onTitleNew = (e) => {
    this.setState({
      title: e.target.value,
    })
    this.props.onCreateSearchMovies(e.target.value)
    this.props.changeLanding(e.target.value)
  }

  onSubmitNew = (e) => {
    e.preventDefault()
    this.props.onCreateSearchMovies(this.state.title)
    this.props.changeLanding(this.state.title)
  }

  render() {
    return (
      <form onSubmit={this.onSubmitNew}>
        <Input type="text" placeholder="Type to search..." value={this.state.title} onChange={this.onTitleNew} />
      </form>
    )
  }
}
