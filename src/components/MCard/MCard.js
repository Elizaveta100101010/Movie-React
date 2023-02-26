import React, { Component } from 'react'
import { format, parseISO } from 'date-fns'
import { Card, Image, Tag, Rate, Typography, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

import { GenresConsumer } from '../GContext'
import MovieService from '../../services/MovieService'

import icon from './csaff-no-poster.jpg'
import './MCard.css'
const { Paragraph } = Typography

export default class MCard extends Component {
  MovieService = new MovieService()

  state = {
    ratingValue: 0,
  }

  urlPosters = 'https://image.tmdb.org/t/p/original/'

  truncate(str, count) {
    if (str.length <= count) {
      return str
    }
    const subString = str.slice(0, count - 1)
    return subString.slice(0, subString.lastIndexOf(' ')) + '...'
  }

  rating(rate) {
    if (rate <= 2 && rate > 0) return '#ee6055'
    if (rate > 3 && rate < 5) return '#ff9b85'
    if (rate >= 5 && rate < 7) return '#ffd97d'
    if (rate >= 7 && rate < 8) return '#aaf683'
    if (rate >= 7) return '#60d394'
  }

  genresList(genres, genres_ids) {
    const newArray = []
    genres_ids.forEach((id) =>
      genres.forEach((item) => {
        if (item.id === id) {
          newArray.push(<Tag className="card-tag-item">{item.name}</Tag>)
        }
      })
    )
    return newArray
  }

  rateMovie = (value) => {
    this.setState({ ratingValue: value })
    const guestID = localStorage.getItem('guestID')
    this.MovieService.rateMovie(
      value,
      `${this.props.apiBase}/movie/${this.props.id}/rating?api_key=${this.props.apiKey}&guest_session_id=${guestID}`
    ).catch(this.onError)
  }

  render() {
    const { title, release_date, overview, poster_path, vote_average, genre_ids, rating } = this.props
    const voteAverage = vote_average.toFixed(1)
    const dateFilm = release_date ? format(parseISO(release_date), 'MMMM dd, yyyy') : 'no release date'
    const urlPoster = !poster_path ? icon : `${this.urlPosters}${poster_path}`

    return (
      <GenresConsumer>
        {(genres) => (
          <Card
            className="card-container"
            hoverable
            cover={
              <Image
                alt="example"
                src={urlPoster}
                placeholder={<Spin indicator={<LoadingOutlined spin />} className="spinner" />}
                style={{ borderRadius: 8 }}
              />
            }
          >
            <div className="card-content">
              <div className="card-header">
                <h5 className="card-title">{this.truncate(title, 30)}</h5>
                <span className="card-rating" style={{ borderColor: this.rating(voteAverage) }}>
                  {voteAverage}
                </span>
              </div>
              <span className="card-date"> {dateFilm}</span>
              <div className="card-tag">{this.genresList(genres, genre_ids)}</div>
              <Paragraph className="card-text">{this.truncate(overview, 150)}</Paragraph>
              <Rate
                className="card-stars"
                count={10}
                value={rating ? rating : this.state.ratingValue}
                onChange={this.rateMovie}
              />
            </div>
          </Card>
        )}
      </GenresConsumer>
    )
  }
}
