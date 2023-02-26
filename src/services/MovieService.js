export default class MovieService {
  async getItems(url) {
    const res = await fetch(url)
    if (!res.ok) {
      return new Error('Server is unavailable')
    }
    const body = await res.json()
    return body
  }

  async getGuestSession(url) {
    const res = await fetch(url)

    if (!res.ok) {
      throw new Error('Failed to create the guest session', res.status)
    }
    const ses = await res.json()
    return ses.guest_session_id
  }

  async rateMovie(values, url) {
    const body = {
      value: values,
    }
    const rate = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(body),
    })

    if (!rate.ok) {
      throw new Error('Rating troubles', rate.status)
    }
  }
}
