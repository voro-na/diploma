import { FC, PropsWithChildren } from 'react';

import { Header } from '@/features/Header';

export const PageLayout: FC<PropsWithChildren> = ({ children }) => {
    return (
        <>
            <Header />
            {children}
        </>
    );
};
