import { render } from 'preact'
import { App } from './app.tsx'
import '../app.css'
import { Provider } from '@/shared/ui/provider.tsx'

const app = document.getElementById('app')
if(!app) throw new Error('No app found')

render(
	<Provider>
		<App />
	</Provider>
, app)
