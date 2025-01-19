import React, { FC, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Button, Snackbar, Stack, TextField } from '@mui/material';
import { FieldArray, FormikHelpers, FormikProvider, useFormik } from 'formik';
import { useUnit } from 'effector-react';
import { collectionModel } from './CreateCollectionPage.model/create-model';
import { CardCreate } from '@/components/components.common/CardCreate/CardCreate';
import { NewMCollectionSchema, CardSchema, validationSelectionSchema } from '@/types/collection';
import { useRouter } from 'next/router';

const initialCollection = {
    title: '',
    description: '',
    author: 'me',
    cards: [{
        description: '',
        termin: '',
    }],
};

export const CreateCollectionPage: FC = () => {

    const [isNotifyOpen, setIsNotifyOpen] = useState(false);
    const router = useRouter();

    const [createCollection, notifyMessage] = useUnit([
        collectionModel.createCollectionFx,
        collectionModel.$notifyMessage])

    const onSubmit = async (values: NewMCollectionSchema, { resetForm }: FormikHelpers<NewMCollectionSchema>) => {
        try {
            await createCollection(values)
            resetForm();
            await router.push('/');
        } catch (_e) { }
        setIsNotifyOpen(true);
    };

    const formik = useFormik<NewMCollectionSchema>({
        initialValues: initialCollection,
        validationSchema: validationSelectionSchema,
        onSubmit,
    });

    const { handleSubmit, handleBlur, handleChange, values, errors, setValues, touched } = formik;

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setIsNotifyOpen(false);
    };

    const handleAddCard = () => {
        setValues({
            ...values,
            cards: [
                ...values.cards,
                {
                    termin: '',
                    description: '',
                },
            ],
        });
    };

    const handleChangeCard = (index: number, fieldName: keyof CardSchema, value: string) => {
        const updatedCards = [...values.cards];
        updatedCards[index][fieldName] = value;
        setValues({
            ...values,
            cards: updatedCards,
        });
    };


    return (
        <>
            <Grid xs={12} md={8} style={{ margin: '20px 50px' }}>
                <FormikProvider value={formik}  >

                    <form onSubmit={handleSubmit}>

                        <Stack direction={'row'} justifyContent='space-between' mb={2}>
                            <Typography variant="h4" gutterBottom>
                                Cоздание подборки
                            </Typography>
                            <div>
                                <Button variant="contained" type='submit' >Cоздать</Button>
                            </div>
                        </Stack>

                        <Stack spacing={2}>
                            <TextField
                                id="title"
                                name='title'
                                value={values.title}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                label="Название"
                                variant="outlined"
                                error={touched.title && Boolean(errors.title)}
                                helperText={touched.title && errors.title}
                            />

                            <TextField
                                id="description"
                                name='description'
                                value={values.description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                label="Описание"
                                variant="outlined"
                                error={touched.description && Boolean(errors.description)}
                                helperText={touched.description && errors.description} />

                            <FieldArray
                                name='cards'
                                render={arrayHelpers => (
                                    <div>
                                        {values.cards.map((card, index) => (
                                            <div key={index}>
                                                <CardCreate
                                                    helpers={arrayHelpers}
                                                    termin={card.termin}
                                                    description={card.description}
                                                    index={index}
                                                    onChange={handleChangeCard}
                                                    touched={touched}
                                                    errors={errors} />
                                            </div>
                                        ))}
                                    </div>
                                )} >

                            </FieldArray>
                        </Stack>
                    </form>
                </FormikProvider>

                <Grid justifyContent='center' display='flex'>

                    <Button variant="contained" onClick={handleAddCard} style={{ marginTop: '20px' }}>
                        Добавить карточку
                    </Button>
                </Grid>

                <Snackbar
                    open={isNotifyOpen}
                    autoHideDuration={3000}
                    message={notifyMessage}
                    onClose={handleClose}
                />
            </Grid>
        </>
    );
};
