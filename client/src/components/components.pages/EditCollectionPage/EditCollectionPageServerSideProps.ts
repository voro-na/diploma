import { fork, allSettled, serialize } from 'effector'
import { collectionModel } from './EditCollectionPage.model/edit-model'
import { GetServerSideProps } from 'next'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'
import { initialCollectionModel } from '../CollectionPage/CollectionPage.model/page-model'
import { fetchCollectionFx } from './EditCollectionPage.api'

export const getEditPageServerSideProps: GetServerSideProps<
    any,
    Params
> = async (context) => {
    const { params } = context

    const scope = fork()

    const authToken = context.req.headers['authorization'];
    const collection = await fetchCollectionFx({header: authToken, id: params?.collectionId})

    await allSettled(collectionModel.pageStarted, { scope, params: {...collection } })

    return {
        props: {
            title: 'edit',
            page: 'edit',
            values: serialize(scope),
        },
    }
}
