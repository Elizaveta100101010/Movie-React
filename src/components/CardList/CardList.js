import React from 'react'

import './CardList.css'
import MCard from '../MCard'

const CardList = ({ movieData, apiBase, apiKey }) => {
  const elements = movieData.map((item) => {
    const { id, ...itemProps } = item
    return <MCard {...item} key={id} apiBase={apiBase} apiKey={apiKey} />
  })
  return <div className="card-list">{elements}</div>
}

export default CardList
