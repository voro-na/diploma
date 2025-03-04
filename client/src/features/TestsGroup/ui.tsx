import { FC } from 'react';
import { useRouter } from 'next/router';

import { Card } from '@mui/material';

import { useGetTestsDetailsQuery } from '@/entities/project/api';

export const TestsGroup: FC = () => {
    const router = useRouter();
    const projectId = router.query.projectId as string;
    const groupSlug = router.query.group as string;
    const featureSlug = router.query.feature as string;

    const { data: featureData, error: featureErr } = useGetTestsDetailsQuery({
        projectSlug: projectId,
        groupSlug,
        featureSlug,
    });

    return (
        <Card variant='outlined'>
            {featureData?.length ? featureData?.[0].name : 'Err'}
        </Card>
    );
};
