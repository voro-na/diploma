
import { createRequestFx } from '@/shared/apiRequest'
import { apiRoutes } from '@/shared/apiRoutes'
import { ICollection, ICollectionDetails } from '@/types/collection'

interface CreateCollection {
    title: string
    description: string
    author: string
    cards: string[]
}

export const fetchCollectionFx = createRequestFx<
    { id: string, header?: string },
    ICollectionDetails
>(({ id, header }) => ({
    url: apiRoutes.collection.list(id),
    method: 'GET',
    header,
}))

export const updateCollectionFx = createRequestFx<
    { id: string; data: CreateCollection },
    ICollection
>(({ id, data }) => ({
    url: apiRoutes.collection.list(id),
    method: 'PUT',
    body: { json: data },
}))
