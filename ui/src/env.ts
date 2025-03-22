export const ENV = {
  API_URL: import.meta.env.VITE_API_URL,
  UI_URL: import.meta.env.VITE_UI_URL
}

console.log('Environment configuration loaded:')
console.log(`API_URL: ${ENV.API_URL}`)
console.log(`UI_URL: ${ENV.UI_URL}`)

