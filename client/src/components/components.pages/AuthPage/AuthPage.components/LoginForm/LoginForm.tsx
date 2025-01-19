import { AuthSchema, validationAuthSchema } from "@/types/auth";
import { Box, TextField, Button } from "@mui/material";
import { FormikHelpers, useFormik } from "formik";
import { useRouter } from "next/router";
import { FC } from "react";
import { createUserFx, loginUserFx } from "../../AuthPage.api";

const TABS_VALUES = ['Вход', 'Регистрация'];

const initialForm: AuthSchema = {
    username: "",
    password: "",
}

export const LoginForm: FC<{ type: number }> = ({ type }) => {
    const router = useRouter();

    const onSubmit = async (values: AuthSchema, { resetForm }: FormikHelpers<AuthSchema>) => {
        if(type === 0){
            const token = await loginUserFx(values);
            document.cookie = `TVM_TOKEN=${token.access_token}`;
        }
        else if(type === 1){
            createUserFx(values);
        }
        resetForm();
        router.push('/');
    };

    const formik = useFormik<AuthSchema>({
        initialValues: initialForm,
        validationSchema: validationAuthSchema,
        onSubmit,
    });

    const { handleSubmit, handleBlur, handleChange, values, errors, touched } = formik;

    return (
        <Box>
            <form onSubmit={handleSubmit}>
                <TextField
                    id='username'
                    name='username'
                    label="Имя пользователя"
                    fullWidth
                    margin="normal"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.username && Boolean(errors.username)}
                    helperText={touched.username && errors.username}
                />
                <TextField
                    id='password'
                    name='password'
                    label="Пароль"
                    fullWidth
                    margin="normal"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                />
                <Button variant="contained" type="submit" color="primary">
                    {TABS_VALUES[type]}
                </Button>
            </form>
        </Box>
    );
};