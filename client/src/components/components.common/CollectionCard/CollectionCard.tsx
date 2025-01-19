
import * as React from 'react';
import { FC, useState } from 'react';
import Link from 'next/link';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    IconButton,
    List,
    ListItemButton,
    ListItemText,
    Popover,
    Stack,
    Typography
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { BasicModal } from '../Modal';
import { ICollection } from '@/types/collection';

type ICollectionCardComponentProps = Omit<ICollection, 'cards'> & {
    onRemove: (payload: { id: string }) => Promise<{}>
    onEdit?: (id: string) => Promise<{}>
    cardAmount: number
};

export const CollectionCard: FC<ICollectionCardComponentProps> = ({ author, description, title, _id, onRemove, cardAmount }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [isRemoveModal, setIsRemoveModal] = useState(false);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleRemove = () => {
        onRemove({ id: _id });
        setIsRemoveModal(false);
    };

    return (
        <Box sx={{ minWidth: 275 }}>
            <Card variant="outlined" sx={{ pl: 2 }}>
                <CardContent>
                    <Stack direction="row" spacing={2} justifyContent={'space-between'}>
                        <Typography variant="h5" component="div" sx={{ mb: 1.5 }}>
                            {title}
                        </Typography>
                        <IconButton aria-describedby={'simple-popover'} onClick={handleClick}>
                            <MoreHorizIcon />
                        </IconButton>

                        <Popover
                            id={'simple-popover'}
                            open={Boolean(anchorEl)}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                        >
                            <List component="nav" aria-label="secondary mailbox folder" onClick={handleClose}>
                                <ListItemButton>
                                    <Link href={`edit/${_id}`} style={{textDecoration: 'none', color: 'black'}}>
                                        <ListItemText primary="Редактировать" />
                                    </Link>
                                </ListItemButton>
                                <ListItemButton
                                    onClick={() => setIsRemoveModal(true)}
                                >
                                    <ListItemText primary="Удалить" />
                                </ListItemButton>
                            </List>
                        </Popover>

                    </Stack>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {description}
                    </Typography>

                    <Stack direction={'row'} spacing={1}>
                        <Chip label={`Количество карт: ${cardAmount}`} size="small" sx={{ mb: 1.5 }} color="primary" variant="outlined" />
                        <Chip label={`Автор: ${author}`} size="small" sx={{ mb: 1.5 }} color="primary" variant="outlined" />
                    </Stack>
                </CardContent>

                <CardActions sx={{ display: 'flex', justifyContent: 'flex-end', pr: 3, pb: 2 }}>
                    <Link href={`/library/${_id}`} >
                        <Button size="small" variant='contained'>Изучить подборку</Button>
                    </Link>
                </CardActions>

                <BasicModal
                    isOpen={isRemoveModal}
                    setIsOpen={setIsRemoveModal}
                    confirmBtn={'Удалить'}
                    closeBtn={'Отмена'}
                    onConfirm={handleRemove}
                    text='Удалить подборку?'
                    caption='Подборка будет удалена из вашей коллекции' />
            </Card>
        </Box >
    );
}