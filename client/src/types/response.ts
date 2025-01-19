import { GetServerSidePropsContext } from 'next'
import { HttpError } from './application-error'

export interface IBackendError {
    code: string
    details: string
}

export interface IResponse<TResult = object> extends HttpError {
    result: TResult
}

export type IErrorResponse<TError = HttpError> = Omit<IResponse, 'error'> & {
    statusCode: TError
}

export function isErrorResponse<TError>(
    response: IResponse
): response is IErrorResponse<TError> {
    return response?.statusCode != null
}

export type TRequest = GetServerSidePropsContext['req'] & Record<string, any>
