
import { createRequestFx } from '@/shared/apiRequest'
import { apiRoutes } from '@/shared/apiRoutes'
import { ICollection } from '@/types/collection'

export const fetchCollectionsFx = createRequestFx<{ header?: string }, ICollection[]>(({ header }) => ({
    url: apiRoutes.library.index,
    method: 'GET',
    header,
}))

export const removeCollectionFx = createRequestFx<{ id: string }, object>(
    ({ id }) => ({
        url: apiRoutes.library.remove(id),
        method: 'DELETE',
    })
)
