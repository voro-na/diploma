import * as yup from 'yup'

export interface ICollection {
    title: string
    description: string
    _id: string
    author: string
    cards: string[]
}

export interface ICollectionItem {
    termin: string
    description: string
    isLiked: boolean
    _id: string
}

export interface ICollectionDetails {
    title: string
    description: string
    _id: string
    author: string
    cards: ICollectionItem[]
}

const validationErrors = {
    title: 'Название не указано',
    description: 'Описание не указано',
    termin: 'Термин не указан',
}

export const validationCardSchema = yup.object({
    termin: yup.string().required(validationErrors.termin),
    description: yup.string().required(validationErrors.description),
})

export const validationSelectionSchema = yup.object({
    title: yup.string().required(validationErrors.title),
    description: yup.string().required(validationErrors.description),
    author: yup.string().required(),
    cards: yup.array().of(validationCardSchema).required(),
})

export type NewMCollectionSchema = yup.InferType<
    typeof validationSelectionSchema
>

export type CardSchema = yup.InferType<typeof validationCardSchema>
