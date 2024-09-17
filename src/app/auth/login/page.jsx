'use client'

import { Card, CardContent, CardActions, Button, Input, Typography, Box } from '@mui/material'
import { Formik, Form, Field } from 'formik'
import { useRouter } from 'next/navigation'
import * as Yup from 'yup'
import AuthLayout from '../layout'
import { useState } from 'react';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
})

export default function LoginForm() {
  const route = useRouter();
  const [error, setError] = useState(null); // State to handle error messages

  const handleLogin = async (values, { setSubmitting }) => {
    setError(null); // Reset error message
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      console.log(response,"data");
      const data = await response.json();
      console.log(data,"data");
      
      if (!response.ok) {
        // Handle errors
        setError(data.message);
        setSubmitting(false);
        return;
      }

      // Handle successful login, e.g., redirect or store token
      alert('Login successful!');
      // You can redirect or save the token as needed here

    } catch (error) {
      console.error('Login error:', error);
      setError('Something went wrong. Please try again.');
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
          {error && (
            <Typography variant="body2" color="error" align="center">
              {error}
            </Typography>
          )}
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
    </Box>
  )
}
LoginForm.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;
