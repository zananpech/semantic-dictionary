import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import '@/global.css';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { Colors } from '@/lib/colors';

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="dark">
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.pageBg },
          animation: 'slide_from_right',
        }}
      />
    </GluestackUIProvider>
  );
}
