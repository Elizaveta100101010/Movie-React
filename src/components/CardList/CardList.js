import React from 'react'

import './CardList.css'
import MovieCard from '../MovieCard'

const CardList = ({ movieData }) => {
  const elements = movieData.map((item) => {
    const { id, ...itemProps } = item
    return <MovieCard {...item} key={id} />
  })
  return <div className="card-list">{elements}</div>
}

export default CardList
