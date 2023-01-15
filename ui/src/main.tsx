import 'vite/modulepreload-polyfill'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app'
import './index.css'
// import { GoogleOAuthProvider } from '@react-oauth/google'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* <GoogleOAuthProvider
      clientId=''
    >
    </GoogleOAuthProvider> */}
    <App />
  </React.StrictMode>,
)
