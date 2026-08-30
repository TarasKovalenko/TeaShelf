import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { App } from '@/App'
import { I18nProvider } from '@/i18n'
import './index.css'

const container = document.getElementById('root')
if (!container) throw new Error('Missing #root element in index.html')

createRoot(container).render(
  <StrictMode>
    <I18nProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </I18nProvider>
  </StrictMode>,
)
