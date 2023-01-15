export const generateTrackingId = (): string =>
  Date.now().toString(36) + Math.random().toString(36).substring(2)

export const guardedFetch = (
  url: string,
  options: Parameters<typeof fetch>[1] = {}
): Promise<Response> => {
  const trackingId: string = generateTrackingId()

  if (!options.headers) {
    options.headers = {}
  }

  // @ts-ignore
  options.headers['x-tid'] = trackingId

  return fetch(url, options)
    .then(async r => {
      if (r.status >= 400) {
        const err = new Error(
          `HTTP ${r.status} ${r.statusText} responded for ${options.method || 'GET'} ${url}`
        ) as Error & Record<string, unknown>

        err.url = url
        err.method = options?.method || 'GET'
        err.status = r.status
        err.statusText = r.statusText
        err.body = await r.text()
        err.trackingId = trackingId

        throw err
      }

      return r
    })
}

const fetchJSON = async <T = unknown>(
  url: string,
  options: Parameters<typeof fetch>[1] = {}
): Promise<T> => {
  // @ts-ignore
  if (['POST', 'PUT'].includes(options?.method)) {
    if (!options?.headers) {
      options.headers = {}
    }

    // @ts-ignore
    options.headers['content-type'] = 'application/json'
  }

  const r = await guardedFetch(url, options)

  return r.json()
}

export const getJSON = <T = unknown>(
  url: string
): Promise<T> => fetchJSON<T>(url)

export const postJSON = <T = unknown, P = unknown>(
  url: string,
  data: P,
  options = {}
): Promise<T> => fetchJSON<T>(url, {
  method: 'POST',
  body: JSON.stringify(data),
  ...options,
})

export const putJSON = <T = unknown, P = unknown>(
  url: string,
  data: P
): Promise<T> => fetchJSON<T>(url, {
  method: 'PUT',
  body: JSON.stringify(data),
})

export const deleteJSON = <T = unknown>(
  url: string
): Promise<T> => fetchJSON<T>(url, {
  method: 'DELETE',
})
