import { createEvent, restore, sample } from 'effector'
import { atom } from '@/shared/atom'
import { fetchCollectionFx, removeCardFx } from '../CollectionPage.api'
import { ICollectionDetails } from '@/types/collection'

export const initialCollectionModel = {
    title: '',
    description: '',
    author: '',
    cards: [],
    _id: '',
}

export const collectionModel = atom(() => {
    const pageStarted = createEvent<ICollectionDetails>()
    const removeCard = createEvent<{ cardId: string }>()

    const $collection = restore(pageStarted, initialCollectionModel)

    sample({
        clock: fetchCollectionFx.doneData,
        target: $collection,
    })

    sample({
        clock: removeCard,
        fn: ({ cardId }) => ({
            cardId,
            collectionId: $collection.map((r) => r._id).getState(),
        }),
        target: removeCardFx,
    })

    sample({
        clock: removeCardFx.doneData,
        fn: () => ({ id: $collection.map((r) => r._id).getState() }),
        target: fetchCollectionFx,
    })

    return {
        pageStarted,
        $collection,
        removeCard,
        fetchCollection: fetchCollectionFx
    }
})
