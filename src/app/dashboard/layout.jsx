"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from "@mui/material";

export default function DashboardLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('auth-token');

    if (!token) {
      router.push('../auth/login');
    }
  }, [router]);

  return (
    <Container
      maxWidth="xl"
     
    >
      {children}
    </Container>
  );
}
