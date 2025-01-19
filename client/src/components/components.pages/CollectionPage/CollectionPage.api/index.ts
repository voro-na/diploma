
import { createRequestFx } from '@/shared/apiRequest';
import { apiRoutes } from '@/shared/apiRoutes';
import { ICollectionDetails } from '@/types/collection'

export const fetchCollectionFx = createRequestFx<
    { id: string, header?: string },
    ICollectionDetails
>(({ id, header }) => ({
    url: apiRoutes.collection.list(id),
    method: 'GET',
    header
}))

export const removeCardFx = createRequestFx<
    { collectionId: string; cardId: string },
    void
>(({ cardId, collectionId }) => ({
    url: apiRoutes.card.index(collectionId, cardId),
    method: 'DELETE',
}))
