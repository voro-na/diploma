import React, { FC } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { LibraryCards } from './LibraryPage.components/LibraryCards';
import { Button, Stack } from '@mui/material';
import Link from 'next/link';

export const LibraryPage: FC = () => {

    return (
        <>
            <Grid xs={12} md={8} style={{ margin: '20px 50px' }}>
                <Stack direction='row' justifyContent="space-between">
                    <Typography variant="h4" gutterBottom>
                        Библиотека
                    </Typography>
                    <Link href={'/create'}>
                        <Button type='button' variant='contained'>Cоздать подборку</Button>
                    </Link>
                </Stack>
                <LibraryCards />
            </Grid>
        </>
    );
};
