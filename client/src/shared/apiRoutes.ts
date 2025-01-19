const BASE_ROUTE = 'http://localhost:3001';

export const apiRoutes = {
    library: {
        index: `${BASE_ROUTE}/collections`,
        remove: (id: string) => `${BASE_ROUTE}/collections/${id}`
    },
    collection: {
        list: (id: string) => `${BASE_ROUTE}/collections/${id}`
    },
    card: {
        index: (collectionId: string, cardId: string) => `${BASE_ROUTE}/collections/${collectionId}/card/${cardId}`,
    },
    auth: {
        login: `${BASE_ROUTE}/auth/login`,
        signUp: `${BASE_ROUTE}/auth/signUp`,
    }
}