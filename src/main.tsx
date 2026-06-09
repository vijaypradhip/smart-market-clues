import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

document.getElementById('root')?.replaceWith(Object.assign(document.createElement('div'), { id: 'root' }))

createRoot(document.getElementById('root')!).render(<App />)