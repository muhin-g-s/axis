import { useContext, useRef } from 'preact/hooks';
import { type ComponentChildren, createContext } from 'preact';
import { type IHttpClient, LoginApi } from '../api/login.api';
import { type AuthSession, LoginService } from '../services/login.service';

interface IdentityContext {
  loginService: LoginService;
}

const IdentityContext = createContext<IdentityContext | null>(null);

interface Dependency {
	httpClient: IHttpClient;
	authSession: AuthSession;
}

interface IdentityContextProviderProps {
	children: ComponentChildren;
	dependency: Dependency;
}

export function IdentityProvider({ children, dependency }: IdentityContextProviderProps) {
  const { httpClient, authSession } = dependency;

  const loginServiceRef = useRef<LoginService>(
		LoginService.getInstance(
			new LoginApi(httpClient),
			authSession
		)
	);

  return (
    <IdentityContext.Provider value={{ loginService: loginServiceRef.current }}>
      {children}
    </IdentityContext.Provider>
  );
}

export function useIdentityContext() {
	const context = useContext(IdentityContext);

	if (!context) {
		throw new Error("useIdentityContext must be used within IdentityProvider");
	}

	return context;
}
