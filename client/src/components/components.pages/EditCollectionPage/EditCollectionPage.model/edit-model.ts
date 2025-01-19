import { atom } from '@/shared/atom'
import { ICollectionDetails } from '@/types/collection'
import { createEvent, createStore, restore, sample } from 'effector'
import { fetchCollectionFx, updateCollectionFx } from '../EditCollectionPage.api'

export const collectionModel = atom(() => {
    const pageStarted = createEvent<ICollectionDetails>()

    const $collection = restore(pageStarted, {
        title: '',
        description: '',
        author: 'me',
        cards: [],
        _id: '',
    })

    const $notifyMessage = createStore<string>('')

    sample({
        clock: updateCollectionFx.doneData,
        fn: () => 'Подборка успешно отредактирована!',
        target: $notifyMessage,
    })

    sample({
        clock: updateCollectionFx.fail,
        fn: () => 'Ошибка при редактировании подборки!',
        target: $notifyMessage,
    })

    sample({
        clock: fetchCollectionFx.doneData,
        target: $collection,
    })

    return {
        pageStarted,
        $notifyMessage,
        $collection,
        updateCollectionFx,
        fetchCollection: fetchCollectionFx,
    }
})
