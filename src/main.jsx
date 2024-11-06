import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { NextUIProvider } from '@nextui-org/react'
import { Toaster } from 'sonner'
import { BrowserRouter } from 'react-router-dom'
import { createStore } from 'redux'
import { reducers } from './store/index.js'
import { Provider } from 'react-redux'

const store = createStore(reducers);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <NextUIProvider>
        <BrowserRouter>
          <Toaster position='top-right' />
          <App />
        </BrowserRouter>
      </NextUIProvider>
    </Provider>
  </StrictMode>,
)
