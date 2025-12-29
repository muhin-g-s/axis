import { AsyncRoute, RouteNames, PrefetchLink } from '@/shared/navigation'
import { Provider } from '@/shared/ui/provider'
import { Router, Switch } from 'wouter-preact'

export function App() {
  return (
			<Router>
				<div className="app-container">
					<header>
						<nav>
							<PrefetchLink routeName={RouteNames.HOME}>
								<button>Home</button>
							</PrefetchLink>
							<PrefetchLink routeName={RouteNames.TEST}>
								<button>Test</button>
							</PrefetchLink>
							<PrefetchLink routeName={RouteNames.REGISTRATION}>
								<button>Register</button>
							</PrefetchLink>
						</nav>
					</header>

					<main>
						<Switch>
							<AsyncRoute path={RouteNames.HOME} />
							<AsyncRoute path={RouteNames.TEST} />
							<AsyncRoute path={RouteNames.TODO_DETAIL} />
							<AsyncRoute path={RouteNames.REGISTRATION} />
						</Switch>
					</main>
				</div>
			</Router>
  )
}
