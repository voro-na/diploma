import { FC } from 'react';

import { Stack, Typography } from '@mui/material';

import { PieChartWithCenterLabel } from '@/features/PieChart';
import { IFeature, ITestGroup } from '@/entities/project/types';

import styles from '../styles.module.css';

interface TestsTableHeaderProps {
    info: IFeature;
    tests: ITestGroup[];
}

export const TestsTableHeader: FC<TestsTableHeaderProps> = ({ info, tests }) => {
    return (
        <div className={styles.infoContainer}>
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
            <PieChartWithCenterLabel tests={tests}/>
        </div>
    );
};
