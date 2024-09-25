'use client'

import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Box, Card, CardContent, CardActions, Button, Input, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
})

export default function ForgotPasswordForm() {
  const router = useRouter();
const forgotApi =async(values,{ setSubmitting }) =>  {  
  try {
    const response = await fetch('/api/forgot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: values.email }),
    });
    
    const data = await response.json();    
    if (response.status === 200) {
      toast.info(`Password reset link sent to ${values.email}`)
      router.push('./login');
    } else {
      toast.error(data.message || 'An error occurred')
    }
  } catch (error) {
    toast.error(error)
  } finally {
    setSubmitting(false);
  }
}
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#edf4f5',
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', p: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom align="center">
            Forgot Password
          </Typography>
          <Formik
            initialValues={{ email: '' }}
            validationSchema={ForgotPasswordSchema}
            onSubmit={forgotApi}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <Box mb={3}>
                  <Typography component="label" htmlFor="email">
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

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isSubmitting}
                  sx={{ py: 1.5 }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>

        <CardActions sx={{ justifyContent: 'center', mt: 2 }}>
          <Button variant="text" onClick={() => router.push('./login')}>
            Back to Login
          </Button>
        </CardActions>
      </Card>
      <ToastContainer />
    </Box>
  );
}
