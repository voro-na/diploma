import { FC } from 'react';
import { Stack, Typography } from '@mui/material';
import { PieChartWithCenterLabel } from '@/features/PieChart';
import styles from '../styles.module.css';
import { IFeature } from '@/entities/project/types';

interface TestsTableHeaderProps {
    info: IFeature;
}

export const TestsTableHeader: FC<TestsTableHeaderProps> = ({ info }) => {
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
            <PieChartWithCenterLabel
                allTests={info.allTestCount}
                passTests={info.passTestCount}
            />
        </div>
    );
};
