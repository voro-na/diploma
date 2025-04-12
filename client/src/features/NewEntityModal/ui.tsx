import { FC } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField
} from '@mui/material';

import { AddGroupModalProps, FormValues } from './types';

const validationSchema = Yup.object({
    name: Yup.string().required('Обязательное поле'),
    slug: Yup.string().required('Обязательное поле'),
    description: Yup.string()
});

const initialValues: FormValues = {
    name: '',
    slug: '',
    description: ''
};

export const AddGroupModal: FC<AddGroupModalProps> = ({ open, onClose, onSubmit, title }) => {
    const formik = useFormik<FormValues>({
        initialValues,
        validationSchema,
        onSubmit: (values, { resetForm }) => {
            onSubmit(values.name, values.slug, values.description);
            resetForm();
            onClose();
        }
    });

    const handleClose = () => {
        formik.resetForm();
        onClose();
    };

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase().replace(/\s+/g, '-');
        void formik.setFieldValue('slug', value);
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            id="name"
                            name="name"
                            label="Введите название"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            fullWidth
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                            autoFocus
                        />
                        <TextField
                            id="slug"
                            name="slug"
                            label="Введите слаг"
                            value={formik.values.slug}
                            onChange={handleSlugChange}
                            onBlur={formik.handleBlur}
                            fullWidth
                            error={formik.touched.slug && Boolean(formik.errors.slug)}
                            helperText={
                                (formik.touched.slug && formik.errors.slug) || 
                                'Уникальный идентификатор для URL (только латинские буквы, цифры и дефисы)'
                            }
                        />
                        <TextField
                            id="description"
                            name="description"
                            label="Описание"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            fullWidth
                            multiline
                            rows={3}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Отмена</Button>
                    <Button type="submit" variant="contained" color="primary">
                        Добавить
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
