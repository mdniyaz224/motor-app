'use client'

import { Card, CardContent, CardActions, Button, Input, Typography, Box } from '@mui/material'
import { Formik, Form, Field } from 'formik'
import { useRouter } from 'next/navigation'
import * as Yup from 'yup'
import AuthLayout from '../layout'
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
})

export default function LoginForm() {
  const route = useRouter();
  // const [error, setError] = useState(null); // State to handle error messages

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();      
      if (!response.ok) {
        toast.error(data.message || 'Login failed. Please try again.')
        setSubmitting(false);
        return;
      }
      localStorage.setItem('auth-token', data.token);
      toast.success('Login successful!');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', p: 3 }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom align="center">
            Login
          </Typography>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
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

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isSubmitting}
                  sx={{ py: 1.5 }}
                >
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>

        <CardActions sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
          <Button variant="text" onClick={() => route.push('./forgot')} sx={{ mb: 1 }}>
            Forgot Password?
          </Button>
          <Typography variant="body2">
            Don't have an account?{' '}
            <Button variant="text" onClick={() => route.push('./register')}>
              Register
            </Button>
          </Typography>
        </CardActions>
      </Card>
      <ToastContainer />
    </Box>
  )
}
LoginForm.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;
