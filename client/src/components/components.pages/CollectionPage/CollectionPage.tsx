import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { ListItem } from '@/components/components.common/ListItem';
import Typography from '@mui/material/Typography';
import { useUnit } from 'effector-react';
import { collectionModel } from './CollectionPage.model/page-model';
import { Button, Stack } from '@mui/material';
import Link from 'next/link';

export const CollectionPage = () => {
    const [collection, onRemove] = useUnit(
        [collectionModel.$collection,
        collectionModel.removeCard,
        collectionModel.fetchCollection])

    return (
        <>
            <Grid xs={12} md={8} style={{ margin: '20px 50px' }}>
                <Stack direction='row' justifyContent='space-between' mb={2}>
                    <Typography variant="h5">
                        Карточек в подборке: {collection.cards.length}
                    </Typography>
                    <Link href={`/edit/${collection._id}`}>
                        <Button type='button' variant='contained'>Редактировать подборку</Button>
                    </Link>
                </Stack>
                {collection.cards.map((item, index) =>
                    <ListItem key={index} {...item} onRemove={onRemove} />)}
            </Grid>
        </>
    );
};

