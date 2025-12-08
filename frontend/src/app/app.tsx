import { HomePage } from '@/pages/home'
import { Route, Switch } from 'wouter-preact'

export function App() {

  return (
    <Switch> 
      < Route  path = "/"  component = { HomePage }  /> 
    </Switch> 
  )
}
