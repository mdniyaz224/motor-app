
import {  Container } from "@mui/material";

export default function AuthLayout({ children }) {
  return (
    <Container
      maxWidth="xl"
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
         backgroundColor:'#edf4f5'
      }}
    >
      {children}
    </Container>
  );
}
