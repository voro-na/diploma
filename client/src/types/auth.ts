import * as yup from 'yup'

const validationErrors = {
    username: 'Имя пользователя не указано',
    password: 'Пароль не указан',
}

export const validationAuthSchema = yup.object({
    username: yup.string().required(validationErrors.username),
    password: yup.string().required(validationErrors.password),
})

export type AuthSchema = yup.InferType<typeof validationAuthSchema>
