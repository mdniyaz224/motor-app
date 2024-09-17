'use client'

import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Box, Card, CardContent, CardActions, Button, Input, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Too Short!').required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
})

export default function RegisterForm() {
    const route=useRouter();

    const handleSubmit = async (values) => {
      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: values.name,
            email: values.email,
            password: values.password,
          }),
        });
    
        if (response.ok) {
          console.log('User registered successfully');
          router.push('/login'); // Redirect to login page on success
        } else {
          const errorData = await response.json();
          console.error('Registration failed:', errorData.message);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      } finally {
       
      }
    };
    
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
         backgroundColor:'#edf4f5'
      }}
    >
      <Card sx={{ maxWidth: 500, width: '100%', p: 3 }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom align="center">
            Register
          </Typography>
          <Formik
            initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
            validationSchema={RegisterSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <Box mb={3}>
                  <Typography variant="body1" component="label" htmlFor="name">
                    Name
                  </Typography>
                  <Field
                    as={Input}
                    fullWidth
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    disableUnderline
                    sx={{
                      mt: 1,
                      p: 1,
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                    }}
                  />
                  {errors.name && touched.name && (
                    <Typography variant="body2" color="error">
                      {errors.name}
                    </Typography>
                  )}
                </Box>

                <Box mb={3}>
                  <Typography variant="body1" component="label" htmlFor="email">
                    Email
                  </Typography>
                  <Field
                    as={Input}
                    fullWidth
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    disableUnderline
                    sx={{
                      mt: 1,
                      p: 1,
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                    }}
                  />
                  {errors.email && touched.email && (
                    <Typography variant="body2" color="error">
                      {errors.email}
                    </Typography>
                  )}
                </Box>

                <Box mb={3}>
                  <Typography variant="body1" component="label" htmlFor="password">
                    Password
                  </Typography>
                  <Field
                    as={Input}
                    fullWidth
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    disableUnderline
                    sx={{
                      mt: 1,
                      p: 1,
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                    }}
                  />
                  {errors.password && touched.password && (
                    <Typography variant="body2" color="error">
                      {errors.password}
                    </Typography>
                  )}
                </Box>

                <Box mb={3}>
                  <Typography variant="body1" component="label" htmlFor="confirmPassword">
                    Confirm Password
                  </Typography>
                  <Field
                    as={Input}
                    fullWidth
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    disableUnderline
                    sx={{
                      mt: 1,
                      p: 1,
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                    }}
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <Typography variant="body2" color="error">
                      {errors.confirmPassword}
                    </Typography>
                  )}
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  Register
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>

        <CardActions sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Button variant="text" onClick={() =>route.push('./login')}>
              Login
            </Button>
          </Typography>
        </CardActions>
      </Card>
    </Box>
  )
}
RegisterForm.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;
