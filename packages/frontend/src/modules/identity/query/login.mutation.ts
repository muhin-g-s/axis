import { useMutation } from '@tanstack/react-query'
import { type LoginPayload } from '../model/login.model'
import { type MutationResult } from '@/shared/utils/tanstack'
import { useIdentityContext } from '../hooks/identity.context';

export function useLogin(): MutationResult<LoginPayload> {
		const { loginService } = useIdentityContext();

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginService.login(payload.email, payload.password),
  })
}
