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
import { GenresProvider } from '../GenreContext'
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
    landing: 'popular',
    request: '',
    tab: 1,
    currentPage: 1,
  }

  componentDidMount() {
    this.createPopularMovies()
    this.takeGenres()
    this.takeGuestSession()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.currentPage !== prevState.currentPage) {
      if (this.state.landing === 'search') this.createSearchMovies(this.state.request)
      else this.createPopularMovies()
    }
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

  takeGenres = () => {
    this.MovieService.getGenresList()
      .then((genres) => {
        this.setState({
          genres: genres.genres,
        })
      })
      .catch(this.onError)
  }

  takeGuestSession = () => {
    if (!localStorage.getItem('guestID')) {
      this.MovieService.getGuestSession()
        .then((res) => {
          localStorage.setItem('guestID', res)
        })
        .catch(this.onError)
    }
  }

  changePage = (page) => {
    this.setState({
      currentPage: page,
    })
  }

  createSearchMovies = debounce((title) => {
    this.setState({ movieData: [], loading: true })
    this.MovieService.getSearchMovies(title, this.state.currentPage)
      .then((list) => {
        this.setData(list)
      })
      .catch(this.onError)
  }, 1500)

  createPopularMovies = () => {
    this.setState({ movieData: [], loading: true })
    this.MovieService.getPopularMovies(this.state.currentPage)
      .then((list) => {
        this.setData(list)
      })
      .catch(this.onError)
  }

  createRatedMovies = (guestID) => {
    this.setState({ movieData: [], loading: true })
    this.MovieService.getRatedMovies(guestID)
      .then((list) => {
        this.setData(list)
      })
      .catch(this.onError)
  }

  setData = (list) => {
    this.setState({
      movieData: [...list.results],
      totalPages: list.total_pages,
      totalResults: list.total_results,
      loading: false,
    })
  }
  onChangeTab = (index) => {
    console.log(index)
    if (index === '2') {
      const guestID = localStorage.getItem('guestID')
      this.setState({ tab: index })
      this.createRatedMovies(guestID)
    } else {
      this.createPopularMovies()
      this.setState({ tab: index })
    }
  }

  render() {
    const { movieData, loading, error, totalPages, totalResults, genres, tab } = this.state
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
    const content = hasData ? <CardList movieData={movieData} /> : null
    const searcher =
      tab == 1 ? <Search onCreateSearchMovies={this.createSearchMovies} changeLanding={this.changeLanding} /> : null
    const pager = totalPages > 1 ? <Pages pages={numberPages} onChangePage={this.changePage} /> : null

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
