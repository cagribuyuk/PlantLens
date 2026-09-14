import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import { Stack } from 'expo-router';

import { Colors } from '../constants/theme';

import {
  IdentificationProvider,
} from '../context/IdentificationContext';

const queryClient =
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 30_000,
      },

      mutations: {
        retry: 0,
      },
    },
  });

export default function RootLayout() {
  return (
    <QueryClientProvider
      client={queryClient}
    >
      <IdentificationProvider>
        <Stack
          screenOptions={{
            contentStyle: {
              backgroundColor:
                Colors.background,
            },

            headerStyle: {
              backgroundColor:
                Colors.background,
            },

            headerShadowVisible:
              false,

            headerTintColor:
              Colors.textPrimary,

            headerTitleStyle: {
              fontWeight: '700',
            },
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="identify"
            options={{
              title:
                'Identify Plant',
            }}
          />

          <Stack.Screen
            name="result"
            options={{
              title:
                'Plant Result',
            }}
          />
        </Stack>
      </IdentificationProvider>
    </QueryClientProvider>
  );
}