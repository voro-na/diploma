import { FC } from 'react';
import { useRouter } from 'next/router';

import { Card, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { PieChartWithCenterLabel } from '@/features/PieChart';
import { useGetTestsDetailsQuery } from '@/entities/project';

const rows = [
    { id: 1, username: '@MUI' },
    { id: 2, username: '@MUI-X' },
];

export const TestsGroup: FC = () => {
    const router = useRouter();
    const projectId = router.query.projectId as string;
    const groupSlug = router.query.group as string;
    const featureSlug = router.query.feature as string;

    const { data: featureData } = useGetTestsDetailsQuery({
        projectSlug: projectId,
        groupSlug,
        featureSlug,
    });

    if (!featureData) {
        return;
    }

    const { info } = featureData;

    return (
        <Card variant='outlined'>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    marginBottom: '10px',
                }}
            >
                <Stack direction='column' justifyContent='center'>
                    <Typography
                        component='h1'
                        variant='subtitle1'
                        sx={{ fontWeight: 'bold' }}
                    >
                        {info.name}
                    </Typography>
                    <Typography
                        component='h2'
                        variant='subtitle2'
                        sx={{ marginBottom: 2 }}
                        gutterBottom
                    >
                        {info.description}
                    </Typography>
                </Stack>
                <PieChartWithCenterLabel
                    allTests={info.allTestCount}
                    passTests={info.passTestCount}
                />
            </div>

            <DataGrid
                hideFooter
                columns={[
                    {
                        field: 'status',
                        headerName: 'Статус',
                        sortable: false,
                        filterable: false,
                        hideable: false,
                        groupable: false,
                        disableColumnMenu: true,
                    },
                    {
                        field: 'test',
                        headerName: 'Название теста',
                        sortable: false,
                        filterable: false,
                        hideable: false,
                        groupable: false,
                        disableColumnMenu: true,
                        flex: 1,
                    },
                ]}
                rows={rows}
            />
        </Card>
    );
};
