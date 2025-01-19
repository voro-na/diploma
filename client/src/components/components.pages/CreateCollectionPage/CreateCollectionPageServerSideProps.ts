import { fork, allSettled, serialize } from 'effector'
import { collectionModel } from './CreateCollectionPage.model/create-model'

export const getCreateEditPageServerSideProps = async () => {
    const scope = fork()
    await allSettled(collectionModel.pageStarted, { scope })

    return {
        props: {
            title: 'create',
            page: 'create',
            values: serialize(scope),
        },
    }
}
