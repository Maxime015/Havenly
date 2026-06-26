import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Linking,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

export default function MapScreen() {
  const { latitude, longitude, title, address } = useLocalSearchParams<{
    latitude: string;
    longitude: string;
    title: string;
    address: string;
  }>();
  const router = useRouter();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Couleurs dynamiques
  const iconColor = isDark ? "#f8fafc" : "#111827";
  const primaryColor = isDark ? "#38bdf8" : "#2563EB";

  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
    lng - 0.001
  }%2C${lat - 0.001}%2C${lng + 0.001}%2C${
    lat + 0.001
  }&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-border bg-background">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-9 h-9 items-center justify-center rounded-full bg-card"
        >
          <Ionicons name="arrow-back" size={20} color={iconColor} />
        </TouchableOpacity>

        <View className="flex-1 mx-3">
          <Text
            className="text-foreground font-semibold text-sm"
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text className="text-muted-foreground text-xs" numberOfLines={1}>
            {address}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() =>
            Linking.openURL(`https://maps.google.com/maps?q=${lat},${lng}`)
          }
          className="flex-row items-center gap-1 bg-primary/10 px-3 py-2 rounded-full"
        >
          <Ionicons name="navigate-outline" size={14} color={primaryColor} />
          <Text className="text-primary text-xs font-semibold">
            Google Maps
          </Text>
        </TouchableOpacity>
      </View>

      {/* Full Screen Map */}
      <WebView source={{ uri: mapUrl }} style={{ flex: 1 }} />
    </SafeAreaView>
  );
}
