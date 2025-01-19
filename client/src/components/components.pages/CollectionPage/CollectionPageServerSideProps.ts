import { allSettled, fork, serialize } from 'effector'
import { collectionModel } from './CollectionPage.model/page-model'
import { GetServerSideProps } from 'next'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'
import { fetchCollectionFx } from './CollectionPage.api'

export const getCollectionPageServerSideProps: GetServerSideProps<
    any,
    Params
> = async (context) => {
    const { params } = context

    const scope = fork()

    const authToken = context.req.headers['authorization'];
    const collection = await fetchCollectionFx({ header: authToken || '', id: params?.module })

    await allSettled(collectionModel.pageStarted, { scope, params: { ...collection } })

    return {
        props: {
            title: 'collection',
            page: 'collection',
            values: serialize(scope),
        },
    }
}
