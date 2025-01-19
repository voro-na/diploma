
import { createRequestFx } from '@/shared/apiRequest'
import { apiRoutes } from '@/shared/apiRoutes'
import { ICollection } from '@/types/collection'

interface CreateCollection {
    title: string
    description: string
    author: string
}

export const createCollectionFx = createRequestFx<
    CreateCollection,
    ICollection
>((collection) => ({
    url: apiRoutes.library.index,
    method: 'POST',
    body: { json: collection },
}))
