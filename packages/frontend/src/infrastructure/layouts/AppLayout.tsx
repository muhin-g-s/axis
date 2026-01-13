import { type ComponentChildren } from "preact";

export const AppLayout = ({ children }: { children: ComponentChildren }) =>{
	return (
		<div>
			{children}
		</div>
	);
}
