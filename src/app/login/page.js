import { Card, CardContent, Grid } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { Seo } from 'src/components/seo';
import { LAST_NAME_LENGTH, PASSWORD_LENGTH } from 'src/config/constants';
import { AuthContextType } from 'src/contexts/auth/jwt/auth-context';
import { useAuth } from 'src/hooks/use-auth';
import { useMounted } from 'src/hooks/use-mounted';
import { AuthLayout } from 'src/layouts/auth';
import { tokens } from 'src/locales/tokens';
import { paths } from 'src/paths';
import regex from 'src/regex';
import LoginForm from 'src/sections/auth/login';
import { LOADER_CLOSE, SNACKBAR_OPEN } from 'src/store/constants/common';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';


const initialValues = {
  email: '',
  password: '',
//   deviceId: uuidv4(),
};

const validationSchema = Yup.object({
 
});

const Login = () => {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const isMounted = useMounted();
//   const { signIn } = useAuth<AuthContextType>();
  const onSubmit = async (values) => {
   
  };

  return (
    <>
      <Seo title="Login" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Grid
          container
          justifyContent="center"
          alignItems="center"
        >
          <Grid
            item
            md={6}
          >
            <Card>
              <CardContent>
                <Stack
                  sx={{ mb: 4 }}
                  spacing={1}
                >
                  <Typography variant="h5">{t('login')}</Typography>
                </Stack>
                <LoginForm
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Login;
// Login.getLayout = (page: ReactNode) => <AuthLayout>{page}</AuthLayout>;
