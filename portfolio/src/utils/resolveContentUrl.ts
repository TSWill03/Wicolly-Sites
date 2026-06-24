const EXTERNAL_URL_PATTERN = /^(?:[a-z][a-z\d+.-]*:)?\/\//i
const SPECIAL_PROTOCOL_PATTERN = /^(mailto:|tel:|sms:|data:)/i

function getBasePath() {
  const basePath = import.meta.env.BASE_URL || '/'

  return basePath.endsWith('/') ? basePath : `${basePath}/`
}

export function resolveContentUrl(value: string) {
  if (!value || value.startsWith('#')) {
    return value
  }

  if (EXTERNAL_URL_PATTERN.test(value) || SPECIAL_PROTOCOL_PATTERN.test(value)) {
    return value
  }

  const basePath = getBasePath()
  const normalizedValue = value.startsWith('./') ? value.slice(2) : value

  if (normalizedValue.startsWith('/')) {
    return `${basePath}${normalizedValue.slice(1)}`
  }

  return `${basePath}${normalizedValue}`
}
