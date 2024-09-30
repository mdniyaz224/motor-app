"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from "@mui/material";

export default function AuthLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    console.log(token,"token");
    
    if (token) {
      // If user is logged in, redirect to the dashboard
      router.push('../dashboard/list');
    }
  }, [router]);

  return (
    <Container
      maxWidth="xl"
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#edf4f5',
      }}
    >
      {children}
    </Container>
  );
}
