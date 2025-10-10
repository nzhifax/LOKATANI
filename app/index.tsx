import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Loading } from '../components/common/Loading';
import { useAuth } from '../contexts/AuthContext';

export default function Index() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace('/(tabsBuyer)/homeBuyer');
      } else {
        router.replace('/auth/login');
      }
    }
  }, [user, isLoading]);

  return <Loading />;
}