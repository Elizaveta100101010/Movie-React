import React, { Component } from 'react'
import './Pages.css'
import { Pagination } from 'antd'

export default class Pages extends Component {
  render() {
    const { pages, onCreateMovieList, landing, request, apiBase, apiKey } = this.props
    const url =
      landing === 'popular'
        ? `${apiBase}/movie/popular?api_key=${apiKey}&page=`
        : `${apiBase}/search/movie?api_key=${apiKey}&query=${request}&page=`
    return (
      <Pagination
        className="pagination-list"
        size="small"
        total={pages}
        onChange={(num) => onCreateMovieList(`${url}${num}`)}
      />
    )
  }
}
