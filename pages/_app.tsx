import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabase';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useStore from '../store';

/*const queryClient = new QueryClient({
    defaultOptions: {
            queries: {
              refetchOnWindowFocus: false,
              retry: false,
            },
          },
        });

function MyApp({ Component, pageProps }: AppProps) {
    const { push, pathname } = useRouter();
    const validateSession = async () => {
      const user = supabase.auth.user();
      if (user && pathname !== '/') {
        push('/notes');
      } else if (!user && pathname !== '/') {
        push('/');
      }
      };

      supabase.auth.onAuthStateChange((event, _) => {
        if (event === 'SIGNED_IN' && pathname === '/') {
          push('/notes');
        }
        if (event === 'SIGNED_OUT') {
          push('/');
        }
        }
      );

    useEffect(() => {
      validateSession();
    }, []);

  return(
  <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
  </QueryClientProvider>
  )
}
*/

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  const { push, pathname } = useRouter();
  const setUserId = useStore((state) => state.setUserId); // 追加

  useEffect(() => {
    const user = supabase.auth.user(); // v1 の同期API
    setUserId(user?.id ?? null);       // Zustand に保持

    // ログイン状態によるリダイレクト制御
    if (user && pathname === '/') {
      push('/notes');
    } else if (!user && pathname !== '/') {
      push('/');
    }

    const { data: listener } = supabase.auth.onAuthStateChange((event, _) => {
      const newUser = supabase.auth.user();
      setUserId(newUser?.id ?? null);

      if (event === 'SIGNED_IN') {
        push('/notes');
      } else if (event === 'SIGNED_OUT') {
        push('/');
      }
    });

    return () => {
      listener?.unsubscribe();
    };
  }, [pathname, push, setUserId]);

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}
export default MyApp
