export default class MovieService {
  _apiBase = 'https://api.themoviedb.org/3'
  _apiKey = '1cfd329cc2777c76f08432aa58835e40'

  async getSearchMovies(value, page) {
    console.log(`${this._apiBase}/search/movie?api_key=${this._apiKey}&query=${value}&page=${page}`)
    const res = await fetch(`${this._apiBase}/search/movie?api_key=${this._apiKey}&query=${value}&page=${page}`)
    if (!res.ok) {
      return new Error('Server is unavailable')
    }
    const body = await res.json()
    return body
  }

  async getRatedMovies(guestID) {
    const res = await fetch(`${this._apiBase}/guest_session/${guestID}/rated/movies?api_key=${this._apiKey}`)
    if (!res.ok) {
      return new Error('Server is unavailable')
    }
    const body = await res.json()
    return body
  }

  async getPopularMovies(page) {
    console.log(`${this._apiBase}/movie/popular?api_key=${this._apiKey}&page=${page}`)
    const res = await fetch(`${this._apiBase}/movie/popular?api_key=${this._apiKey}&page=${page}`)
    if (!res.ok) {
      return new Error('Server is unavailable')
    }
    const body = await res.json()
    return body
  }

  async getGenresList() {
    const res = await fetch(`${this._apiBase}/genre/movie/list?api_key=${this._apiKey}`)
    if (!res.ok) {
      return new Error('Server is unavailable')
    }
    const body = await res.json()
    return body
  }

  async getGuestSession() {
    const res = await fetch(`${this._apiBase}/authentication/guest_session/new?api_key=${this._apiKey}`)

    if (!res.ok) {
      throw new Error('Failed to create the guest session', res.status)
    }
    const ses = await res.json()
    return ses.guest_session_id
  }

  async rateMovie(values, id, guestID) {
    const body = {
      value: values,
    }
    const rate = await fetch(
      `${this.props.apiBase}/movie/${id}/rating?api_key=${this.props.apiKey}&guest_session_id=${guestID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(body),
      }
    )

    if (!rate.ok) {
      throw new Error('Rating troubles', rate.status)
    }
  }
}
