
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { FC, useState } from 'react';
import Divider from '@mui/material/Divider';
import StarIcon from '@mui/icons-material/Star';
import { IconButton } from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import DeleteIcon from '@mui/icons-material/Delete';
import { BasicModal } from '../Modal';
import { ICollectionItem } from '@/types/collection';

interface IListItemProps extends ICollectionItem {
    onRemove: (payload: { cardId: string }) => void
};

export const ListItem: FC<IListItemProps> = ({ termin: title, description, isLiked, _id, onRemove }) => {
    const [isRemoveModal, setIsRemoveModal] = useState(false);  

    const handleRemove = () => {
        onRemove({ cardId: _id });
        setIsRemoveModal(false);
    };

    return (
        <Box sx={{ minWidth: 275, mb: 2 }} >
            <Card variant="elevation" >
                <CardContent sx={{ display: 'flex', p: 2 }} >
                    <Typography variant="body1" component="div" sx={{ mr: 1.5, display: 'flex', alignItems: 'center', }}>
                        {title}
                    </Typography>
                    <Divider orientation="vertical" flexItem />
                    <Typography variant="body1" component="div" sx={{ ml: 1.5, display: 'flex', alignItems: 'center', flex: 1 }}>
                        {description}
                    </Typography>
                    <IconButton aria-label="next">
                        {isLiked ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
                    <IconButton aria-label="next" onClick={() => setIsRemoveModal(true)}>
                        <DeleteIcon />
                    </IconButton>
                </CardContent>
            </Card>

            <BasicModal
                isOpen={isRemoveModal}
                setIsOpen={setIsRemoveModal}
                confirmBtn={'Удалить'}
                closeBtn={'Отмена'}
                onConfirm={handleRemove}
                text='Удалить карточку?'
                caption='Карточка будет удалена из вашей подборки' />
        </Box>
    );
}