const pairs = [
  'ąa',
  'ęe',
  'ćc',
  'śs',
  'łl',
  'ńn',
  'óo',
  'żz',
  'źz',
]

export const getSlug = (name: string): string => {
  name = name.toLowerCase()

  for (let i = 0; i < pairs.length; i++) {
    const [fromChar, toChar] = pairs[i].split('')

    name = name.replaceAll(fromChar, toChar)
  }

  name = name
    .replace(/_+/g, '-')
    .replace(/[^\w]+/g, '-')
    .replace(/^-/, '')
    .replace(/-$/, '')

  return name
}

export const byId = <T extends {id: string}>(a: T, b: T): number => {
  if (a.id === b.id) return 0

  return a.id < b.id ? 1 : -1
}

export const byField =
  <T>(field: keyof T) =>
    (a: T, b: T): number => {
      if (a[field] === b[field]) return 0

      return a[field] < b[field] ? -1 : 1
    }
