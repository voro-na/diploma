import { FC } from 'react';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';

import { DeleteEntityModalProps } from '../types';


export const DeleteEntityModal: FC<DeleteEntityModalProps> = ({
    open,
    onClose,
    onConfirm,
    entityName,
}) => {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Удаление элемента</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {`Вы уверены, что хотите удалить ${entityName}? Это действие нельзя отменить.`}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>
                <Button onClick={handleConfirm} color="error" variant="contained">
                    Удалить
                </Button>
            </DialogActions>
        </Dialog>
    );
};
