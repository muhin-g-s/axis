import { IdentityProvider } from "@/modules/identity/hooks/identity.context";
import { type ComponentChildren } from "preact";
import { useDiContainer } from "../di/context.di";
import { AppLayout } from "./AppLayout";

export const AuthLayout = ({ children }: { children: ComponentChildren }) =>{
	const dependency = useDiContainer();

	return (
		<AppLayout>
			<IdentityProvider dependency={dependency}>
				<div class="auth-layout">
					{children}
				</div>
			</IdentityProvider>
		</AppLayout>
	);
}
