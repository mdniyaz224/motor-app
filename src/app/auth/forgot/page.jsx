'use client'

import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Box, Card, CardContent, CardActions, Button, Input, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
})

export default function ForgotPasswordForm() {
    const route=useRouter();
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
      <Card sx={{ maxWidth: 400, width: '100%', p: 3 }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom align="center">
            Forgot Password
          </Typography>
          <Formik
            initialValues={{ email: '' }}
            validationSchema={ForgotPasswordSchema}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                alert(`Password reset link sent to ${values.email}`)
                setSubmitting(false)
                onSwitchForm('login')
              }, 400)
            }}
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

        <CardActions sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
          <Typography variant="body2">
            <Button variant="text"onClick={() =>route.push('./login')}>
              Back to Login
            </Button>
          </Typography>
        </CardActions>
      </Card>
    </Box>
  )
}

ForgotPasswordForm.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;
