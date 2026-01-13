import { Router } from "@/infrastructure/routing/router";
import { Providers } from "./providers";

export function App() {
  return (
		<Providers>
			<Router/>
		</Providers>
  )
}
