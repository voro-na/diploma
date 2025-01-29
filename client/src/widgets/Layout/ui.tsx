import { Header } from '@/features/Header';
import { FC, PropsWithChildren } from 'react';

export const PageLayout: FC<PropsWithChildren> = ({ children }) => {
    return (
        <>
            <Header />
            {children}
        </>
    );
};
