import TabScreenBackground from "@/components/TabScreenBackground";
import { useAuth, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Correspondances pour les composants natifs
  const primaryColor = isDark ? "#38bdf8" : "#0284c7";
  const destructiveColor = isDark ? "#fca5a5" : "#ef4444";

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleUpdateProfileImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library to update your profile picture.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (result.canceled) return;

      setIsUpdating(true);

      const base64Image = result.assets[0].base64;
      const uri = result.assets[0].uri;
      const filename = uri.split("/").pop() || "profile.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const mimeType = match ? `image/${match[1]}` : "image/jpeg";
      const dataUrl = `data:${mimeType};base64,${base64Image}`;

      await user?.setProfileImage({ file: dataUrl });

      Alert.alert("Success", "Profile picture updated successfully!");
    } catch (error) {
      console.error("Error updating profile image:", error);
      Alert.alert(
        "Error",
        "Failed to update profile picture. Please try again.",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isLoaded || !user) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        <View className="items-center py-8">
          <View className="absolute top-2 left-0 right-0" pointerEvents="none">
            <TabScreenBackground />
          </View>
          <View className="relative">
            <Image
              source={{ uri: user.imageUrl }}
              className="w-24 h-24 rounded-full mb-4"
            />
            <TouchableOpacity
              onPress={handleUpdateProfileImage}
              disabled={isUpdating}
              className="absolute bottom-3 right-0 bg-primary rounded-full p-2"
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="camera" size={16} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
          <Text className="text-xl font-bold text-foreground">
            {user.firstName} {user.lastName}
          </Text>
          <Text className="text-muted-foreground mt-1">
            {user.emailAddresses[0].emailAddress}
          </Text>
        </View>

        {/* Menu Items */}
        <View className="px-6 gap-2">
          <MenuItem
            icon="heart-outline"
            label="Saved Properties"
            onPress={() => router.push("/(root)/(tabs)/saved")}
          />
          <MenuItem
            icon="notifications-outline"
            label="Notifications"
            onPress={() =>
              Alert.alert("Coming Soon", "Notifications coming soon!")
            }
          />
          <MenuItem
            icon="settings-outline"
            label="Settings"
            onPress={() => Alert.alert("Coming Soon", "Settings coming soon!")}
          />
          <MenuItem
            icon="help-circle-outline"
            label="Help & Support"
            onPress={() =>
              Linking.openURL(
                "mailto:maximeananivi@gmail.com?subject=Help%20%26%20Support%20-%20Kribb%20App",
              )
            }
          />
        </View>

        <View className="px-6 -top-10 mt-auto pb-24 pt-8">
          <TouchableOpacity
            onPress={handleSignOut}
            className="flex-row items-center justify-center gap-2 bg-destructive py-4 rounded-2xl border border-destructive"
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color={destructiveColor}
            />
            <Text className="text-destructive-foreground font-semibold text-base">
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

function MenuItem({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const iconColor = isDark ? "#9CA3AF" : "#6B7280";
  const chevronColor = isDark ? "#4B5563" : "#D1D5DB";

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center gap-4 bg-card border border-border px-4 py-4 rounded-2xl"
    >
      <Ionicons name={icon} size={22} color={iconColor} />
      <Text className="flex-1 text-foreground font-medium text-base">
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={18} color={chevronColor} />
    </TouchableOpacity>
  );
}
