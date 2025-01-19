import { atom } from '@/shared/atom'
import { createEvent, createStore, sample } from 'effector'
import { createCollectionFx } from '../CreateCollectionPage.api'

export const collectionModel = atom(() => {
    const pageStarted = createEvent()

    const $notifyMessage = createStore<string>('')

    sample({
        clock: createCollectionFx.doneData,
        fn: () => 'Подборка успешно создана!',
        target: $notifyMessage,
    })

    sample({
        clock: createCollectionFx.fail,
        fn: () => 'Ошибка при создании подборки!',
        target : $notifyMessage,
    })

    return {
        pageStarted,
        $notifyMessage,
        createCollectionFx,
    }
})
