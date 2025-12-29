import { LayoutRoute, RouteNames } from '@/shared/navigation'
import { Router, Switch } from 'wouter-preact'

export function RouterComponent() {
	return (
		<Router>
			<Switch>
				<LayoutRoute path={RouteNames.REGISTRATION} />
				<LayoutRoute path={RouteNames.LOGIN} />
			</Switch>
		</Router>
	)
}
