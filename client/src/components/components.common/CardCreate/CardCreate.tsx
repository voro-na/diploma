
import * as React from 'react';
import { FC } from 'react';
import { Box, Card, CardContent, IconButton, Stack, TextField, } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { CardSchema, NewMCollectionSchema } from '@/types/collection';
import { FieldArrayRenderProps, FormikErrors, FormikTouched, getIn } from 'formik';

type ICardCreateProps = {
    termin: string,
    description: string,
    onChange: (index: number, fieldName: keyof CardSchema, value: string) => void
    index: number,
    touched?: FormikTouched<NewMCollectionSchema>,
    errors?: FormikErrors<NewMCollectionSchema>,
    helpers: FieldArrayRenderProps,
}


export const CardCreate: FC<ICardCreateProps> = ({
    termin,
    description,
    index,
    onChange: handleCardChange,
    touched,
    errors,
    helpers }) => {

    const errorTermin = getIn(errors, `cards[${index}].termin`);
    const touchTermin = getIn(touched, `cards[${index}].termin`);

    const errorDescription = getIn(errors, `cards[${index}].description`);
    const touchDescription = getIn(touched, `cards[${index}].description`);

    return (
        <Box sx={{ minWidth: 275 }}>
            <Card variant="outlined">
                <CardContent >
                    <Stack direction="row" spacing={2} justifyContent={'space-between'} >
                        <TextField
                            id={`card-termin-${index}`}
                            label="Термин"
                            variant="standard"
                            name={`cards[${index}].termin`}
                            value={termin}
                            fullWidth
                            onChange={(e) => handleCardChange(index, 'termin', e.target.value)}
                            error={touchTermin && errorTermin ? errorTermin : null}
                            helperText={touchTermin && errorTermin} />

                        <TextField
                            id={`card-description-${index}`}
                            label="Описание"
                            variant="standard"
                            name={`cards[${index}].description`}
                            value={description}
                            fullWidth
                            onChange={(e) => handleCardChange(index, 'description', e.target.value)}
                            error={touchDescription && errorDescription ? errorDescription : null}
                            helperText={touchDescription && errorDescription} />

                        <IconButton onClick={() => helpers.remove(index)}>
                            <DeleteIcon />
                        </IconButton>
                    </Stack>
                </CardContent>
            </Card>
        </Box >
    );
}