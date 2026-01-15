import { useContext, useRef } from 'preact/hooks';
import { type ComponentChildren, createContext } from 'preact';
import { type LoginApi } from '../api/login.api';
import { type AuthSession, LoginService } from '../services/login.service';

interface IdentityContext {
  loginService: LoginService;
}

const IdentityContext = createContext<IdentityContext | null>(null);

interface Dependency {
	api: LoginApi;
	authSession: AuthSession;
}

interface IdentityContextProviderProps {
	children: ComponentChildren;
	dependency: Dependency;
}

export function IdentityProvider({ children, dependency }: IdentityContextProviderProps) {
  const { api, authSession } = dependency;

  const loginServiceRef = useRef<LoginService>(
		LoginService.getInstance(
			api,
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
