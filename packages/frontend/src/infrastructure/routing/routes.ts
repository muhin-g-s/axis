import { LoginPage } from "@/modules/identity/ui/view/LoginPage";
import { AuthLayout } from "../layouts/AuthLayout";

export const routes = [
	{
		path: "/login",
		layout: AuthLayout,
		component: LoginPage,
	},
] as const;
