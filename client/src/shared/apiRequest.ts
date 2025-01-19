import { createEffect } from 'effector'
import { HttpError, NetworkError } from '@/types/application-error'
import { IResponse } from '@/types/response'
import Cookies from "universal-cookie";

export interface IRequest {
    url: string | URL
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    body?: { json: unknown }
    header?: string
}

type Payload<TParams> = IRequest | ((params: TParams) => IRequest)


export const createRequestFx = <TParams, TResult>(
    payload: Payload<TParams>,
) => createEffect<TParams, TResult, HttpError>(async (params) => {
    const request = typeof payload === 'function' ? payload(params) : payload

    const cookies = new Cookies();
    const token = cookies.get("TVM_TOKEN");

    const headers = new Headers({ Accept: 'application/json' })

    headers.set('Authorization', request.header || `Bearer ${token}`)


    if (request.body?.json) {
        headers.set('Content-Type', 'application/json')
    }
    try {
        const response = await fetch(request.url, {
            method: request.method,
            body: request.body?.json
                ? JSON.stringify(request.body?.json)
                : undefined,
            headers,
        })
        const body: IResponse = await response.json()

        // if (isErrorResponse(body)) {
        //     throw new HttpError(body.message, body.statusCode)
        // }

        return body as TResult
    } catch (e) {
        throw new NetworkError('Network error')
    }
})
