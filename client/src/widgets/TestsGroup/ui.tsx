import { FC } from 'react';
import { useRouter } from 'next/router';

import { Card, Chip, ChipOwnProps, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { PieChartWithCenterLabel } from '@/features/PieChart';
import { ITestGroup, useGetTestsDetailsQuery } from '@/entities/project';
import { Status } from '@/entities/project';

import styles from './styles.module.css';

interface ITestRowData {
    status?: Status;
    test: string;
    id: string;
}

const renderStatus = (status: Status) => {
    const colors: Record<Status, ChipOwnProps['color']> = {
        [Status.PASS]: 'success',
        [Status.FAIL]: 'error',
        [Status.SKIP]: 'default',
    };

    return <Chip label={status} color={colors[status]} variant='outlined' />;
};

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

    const { info, tests } = featureData;

    const getRowsData = (tests: ITestGroup[]) => {
        return tests.reduce((acc: ITestRowData[], testGroup) => {
            acc.push({
                status: undefined,
                test: testGroup.name,
                id: testGroup._id,
            });

            testGroup.tests.forEach((test) => {
                acc.push({
                    status: test.status,
                    test: test.name,
                    id: test.name + testGroup._id,
                });
            });

            return acc;
        }, []);
    };

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
                        color='textSecondary'
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
                getRowClassName={(params) =>
                    !params.row.status ? styles['group'] : ''
                }
                columns={[
                    {
                        field: 'test',
                        headerName: 'Название теста',
                        headerClassName: styles['header'],
                        sortable: false,
                        filterable: false,
                        hideable: false,
                        groupable: false,
                        disableColumnMenu: true,
                        flex: 1,
                        colSpan: (_, row) => {
                            if (!row.status) {
                                return 2;
                            }

                            return undefined;
                        },
                        valueGetter: (value, row) => {
                            if (!row.status) {
                                return row.test;
                            }
                            return value;
                        },
                    },
                    {
                        field: 'status',
                        headerName: 'Статус',
                        headerClassName: styles['header'],
                        sortable: false,
                        filterable: false,
                        hideable: false,
                        groupable: false,
                        disableColumnMenu: true,
                        renderCell: (params) =>
                            renderStatus(params.value as Status),
                    },
                ]}
                rows={getRowsData(tests)}
            />
        </Card>
    );
};
