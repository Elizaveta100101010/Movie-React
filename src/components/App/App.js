import React, { Component } from 'react'
import './App.css'
import 'antd/dist/reset.css'
import { Spin, Alert } from 'antd'
import { Offline } from 'react-detect-offline'
import { debounce } from 'lodash'

import CardList from '../CardList'
import Header from '../Header'
import Search from '../Search'
import Pages from '../Pages'
import { GenresProvider } from '../GContext'
import MovieService from '../../services/MovieService'

export default class App extends Component {
  _apiBase = 'https://api.themoviedb.org/3'
  _apiKey = '1cfd329cc2777c76f08432aa58835e40'

  MovieService = new MovieService()

  state = {
    movieData: [],
    loading: true,
    error: false,
    totalPages: 0,
    totalResults: 0,
    genres: [],
    tab: 'search',
    landing: 'popular',
    request: '',
  }

  componentDidMount() {
    this.createMovieList(`${this._apiBase}/movie/popular?api_key=${this._apiKey}`)
    this.takeGenres(`${this._apiBase}/genre/movie/list?api_key=${this._apiKey}`)
    this.takeGuestSession(`${this._apiBase}/authentication/guest_session/new?api_key=${this._apiKey}`)
  }

  onError = (err) => {
    this.setState({
      error: true,
      loading: false,
    })
  }

  changeLanding = (request) => {
    this.setState({
      request: request,
      landing: 'search',
    })
  }

  takeGenres = (url) => {
    this.MovieService.getItems(url)
      .then((genres) => {
        this.setState({
          genres: genres.genres,
        })
      })
      .catch(this.onError)
  }

  takeGuestSession = (url) => {
    if (!localStorage.getItem('guestID')) {
      this.MovieService.getGuestSession(url)
        .then((res) => {
          localStorage.setItem('guestID', res)
        })
        .catch(this.onError)
    }
  }

  createMovieList = debounce((url) => {
    this.setState({ movieData: [], loading: true })
    this.MovieService.getItems(url)
      .then((list) => {
        this.setState({
          movieData: [...list.results],
          totalPages: list.total_pages,
          totalResults: list.total_results,
          loading: false,
        })
      })
      .catch(this.onError)
  }, 1500)

  onChangeTab = (index) => {
    if (index === '2') {
      const guestID = localStorage.getItem('guestID')
      this.setState({ tab: 'rated' })
      this.createMovieList(`${this._apiBase}/guest_session/${guestID}/rated/movies?api_key=${this._apiKey}`)
    } else {
      this.createMovieList(`${this._apiBase}/movie/popular?api_key=${this._apiKey}`)
      this.setState({ tab: 'search' })
    }
  }

  render() {
    const { movieData, loading, error, totalPages, totalResults, genres, tab, landing, request } = this.state
    const hasData = !(loading || error)
    const numberPages = totalPages > 5 ? 50 : totalPages * 10
    const errorMessage =
      error || (!loading && !totalResults) ? (
        <AlertMessage
          description="К сожалению мы ничего не нашли ¯\_(ツ)_/¯. Попробуйте подключиться к VPN или поменять запрос."
          type="warning"
        />
      ) : null
    const spinner = loading ? <Spin className="spinner" size="large" /> : null
    const content = hasData ? <CardList movieData={movieData} apiBase={this._apiBase} apiKey={this._apiKey} /> : null
    const searcher =
      tab === 'search' ? (
        <Search
          onCreateMovieList={this.createMovieList}
          apiBase={this._apiBase}
          apiKey={this._apiKey}
          changeLanding={this.changeLanding}
        />
      ) : null
    const pager =
      totalPages > 1 ? (
        <Pages
          pages={numberPages}
          onCreateMovieList={this.createMovieList}
          landing={landing}
          request={request}
          apiBase={this._apiBase}
          apiKey={this._apiKey}
        />
      ) : null

    return (
      <div className="movie-app">
        <Offline>
          <AlertMessage
            description="Подключение к интернету отсутствует. Новые данные не будут загружены. "
            type="error"
          />{' '}
        </Offline>
        <GenresProvider value={genres}>
          <section className="main">
            <Header onChangeTab={this.onChangeTab} />
            {searcher}
            {errorMessage}
            {spinner}
            {content}
            {pager}
          </section>
        </GenresProvider>
      </div>
    )
  }
}
const AlertMessage = ({ description, type }) => {
  return <Alert message="Ошибка" description={description} type={type} showIcon />
}
