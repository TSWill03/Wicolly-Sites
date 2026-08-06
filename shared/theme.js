(() => {
  const storageKey = 'wicolly-theme'
  let stored = null
  try { stored = localStorage.getItem(storageKey) } catch { /* Storage can be unavailable in strict browsing modes. */ }
  const preferred = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  document.documentElement.dataset.theme = stored === 'light' || stored === 'dark' ? stored : preferred
})()
