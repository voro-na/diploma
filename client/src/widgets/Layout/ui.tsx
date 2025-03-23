import { FC, PropsWithChildren } from 'react';

import { Header } from '@/features/Header';

export const PageLayout: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div
            style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center' }}
        >
            <Header />
            {children}
        </div>
    );
};
