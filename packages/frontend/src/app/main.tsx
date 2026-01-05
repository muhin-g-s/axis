import { render } from 'preact'
import { App } from './app'
import '../assets/app.css'

const app = document.getElementById('app')
if(!app) throw new Error('No app found')

render(<App />, app)
