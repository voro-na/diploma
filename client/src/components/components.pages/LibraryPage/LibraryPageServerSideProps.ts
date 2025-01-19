import { allSettled, fork, serialize } from 'effector'
import { libraryModel } from './LibraryPage.model/page-model'
import { GetServerSideProps } from 'next';
import { fetchCollectionsFx } from './LibraryPage.api';

export const getLibraryPageServerSideProps: GetServerSideProps = async (context) => {
    const scope = fork()

    const authToken = context.req.headers['authorization'];
    const cards = await fetchCollectionsFx({header: authToken})

    //@ts-ignore
    if(cards.statusCode === 401){
        return {
            redirect: {
                destination: '/auth',
                permanent: false,
            },
        };
    }

    await allSettled(libraryModel.pageStarted, {
        scope,
        params: {
            cards,
        },
    })

    return {
        props: {
            title: 'library',
            page: 'library',
            values: serialize(scope),
        },
    }
}
