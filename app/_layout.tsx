import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Photogram" }} />
      <Stack.Screen name="albums/[id]" options={{ title: "Albums" }} />
      <Stack.Screen name="photos/[id]" options={{ title: "Photos" }} />
    </Stack>
  );
}
