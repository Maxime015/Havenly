import { formatPrice } from "@/lib/utils";
import { Property } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

export default function FeaturedCard({ property }: { property: Property }) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#9CA3AF" : "#6B7280";

  return (
    <TouchableOpacity
      onPress={() => router.push(`/(root)/property/${property.id}`)}
      className="w-72 mr-4 overflow-hidden rounded-3xl border border-border bg-secondary"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: colorScheme === "dark" ? 0.3 : 0.08,
        shadowRadius: 12,
        elevation: 4,
        opacity: property.is_sold ? 0.5 : 1,
      }}
    >
      {/* Image */}
      <Image
        source={{ uri: property.images[0] }}
        className="w-full h-44"
        resizeMode="cover"
      />

      {/* Badge */}
      <View className="absolute top-3 left-3 bg-primary px-3 py-1 rounded-full">
        <Text className="text-xs font-semibold text-white capitalize">
          {property.type}
        </Text>
      </View>

      {property.is_sold && (
        <View className="absolute top-3 right-3 bg-destructive px-3 py-1 rounded-full">
          <Text className="text-xs font-semibold text-destructive-foreground">
            Vendu
          </Text>
        </View>
      )}

      {/* Info */}
      <View className="p-4">
        <Text
          className="text-base font-bold text-card-foreground mb-1"
          numberOfLines={1}
        >
          {property.title}
        </Text>

        <View className="flex-row items-center gap-1 mb-3">
          <Ionicons name="location-outline" size={13} color={iconColor} />
          <Text className="text-base text-card-foreground" numberOfLines={1}>
            {property.address}, {property.city}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-blue-300 font-bold text-base">
            {formatPrice(property.price)}
          </Text>
          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center gap-1">
              <Ionicons name="bed-outline" size={13} color={iconColor} />
              <Text className="text-xs text-card-foreground">
                {property.bedrooms}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="water-outline" size={13} color={iconColor} />
              <Text className="text-xs text-card-foreground">
                {property.bathrooms}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
