import { AsyncRoute, RouteNames, PrefetchLink } from '@/shared/navigation'
import { Router, Switch } from 'wouter-preact'

export function App() {
  return (
    <Router>
       <PrefetchLink routeName={RouteNames.TEST}>
      <div>Test</div>
    </PrefetchLink>
    <Switch>
      <AsyncRoute path={RouteNames.HOME} />
      <AsyncRoute path={RouteNames.TEST} />
    </Switch>
    </Router>
   
  )
}
