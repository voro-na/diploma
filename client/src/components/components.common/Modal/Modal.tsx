import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import styles from './style.module.css';
import { FC } from 'react';
import { Stack } from '@mui/material';

interface IModalProps {
    isOpen: boolean,
    setIsOpen: (arg: boolean) => void,
    text: string,
    caption: string,
    confirmBtn: string,
    closeBtn: string,
    onConfirm: () => void,
}
export const BasicModal: FC<IModalProps> =
    ({ isOpen, setIsOpen, closeBtn, confirmBtn, onConfirm, text, caption }) => {
        const handleClose = () => setIsOpen(false);

        return (
            <Modal
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className={styles.modal}>
                    <Stack spacing={3}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            {text}
                            <Typography id="modal-modal-title" variant="caption"  component="h3" color="text.secondary">
                                {caption}
                            </Typography>
                        </Typography>
                        <Stack direction='row' spacing={2} justifyContent={'right'}>
                            <Button variant="outlined" onClick={handleClose}>{closeBtn}</Button>
                            <Button variant="contained" onClick={onConfirm}>{confirmBtn}</Button>
                        </Stack>
                    </Stack>
                </Box>
            </Modal>
        );
    }