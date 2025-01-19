import { createEvent, restore, sample } from 'effector'
import { createGate } from 'effector-react'
import { ICollection } from '@/types/collection'
import { atom } from '@/shared/atom'
import { fetchCollectionsFx, removeCollectionFx } from '../LibraryPage.api'

export const libraryModel = atom(() => {
    const SelectionsPageGate = createGate()
    const pageStarted = createEvent<{ cards: ICollection[] }>()

    const $cards = restore(
        pageStarted.map((e) => e.cards),
        []
    )

    sample({
        clock: fetchCollectionsFx.doneData,
        target: $cards,
    })

    sample({
        clock: removeCollectionFx.doneData,
        target: fetchCollectionsFx,
    })

    return {
        pageStarted,
        $cards,
        fetchCollection: fetchCollectionsFx,
        removeCollection: removeCollectionFx,
        SelectionsPageGate,
    }
})
