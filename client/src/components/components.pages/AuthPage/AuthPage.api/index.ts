import { createRequestFx } from '@/shared/apiRequest';
import { apiRoutes } from '@/shared/apiRoutes';
import { AuthSchema } from "@/types/auth";

export const createUserFx = createRequestFx<AuthSchema, void>(
    (user) => ({
        url: apiRoutes.auth.signUp,
        method: 'POST',
        body: { json: user },
    }))

export const loginUserFx = createRequestFx<AuthSchema, { access_token: string }>(
    (user) => ({
        url: apiRoutes.auth.login,
        method: 'POST',
        body: { json: user },
    }))
