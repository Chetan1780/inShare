import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import {store, persistor } from './store'
import { PersistGate } from 'redux-persist/integration/react'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<div>Loading....</div>} persistor={persistor}>
    <ToastContainer/>
    <App />
      </PersistGate>
    </Provider>
  </StrictMode>,
)
