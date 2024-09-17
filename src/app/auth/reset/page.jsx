'use client'

import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Box, Card, CardContent, CardActions, Button, Input, Typography } from '@mui/material'

const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string().min(6, 'Too Short!').required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
})

export default function ResetPasswordForm() {
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
            Reset Password
          </Typography>
          <Formik
            initialValues={{ password: '', confirmPassword: '' }}
            validationSchema={ResetPasswordSchema}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2))
                setSubmitting(false)
                onSwitchForm('login')
              }, 400)
            }}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <Box mb={3}>
                  <Typography variant="body1" component="label" htmlFor="password">
                    New Password
                  </Typography>
                  <Field
                    as={Input}
                    fullWidth
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your new password"
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
                    Confirm New Password
                  </Typography>
                  <Field
                    as={Input}
                    fullWidth
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your new password"
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
                  disabled={isSubmitting}
                  sx={{ py: 1.5 }}
                >
                  {isSubmitting ? 'Resetting...' : 'Reset Password'}
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>

        <CardActions sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
          <Typography variant="body2">
            <Button variant="text"  onClick={() =>route.push('./login')}>
              Back to Login
            </Button>
          </Typography>
        </CardActions>
      </Card>
    </Box>
  )
}
ResetPasswordForm.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;
