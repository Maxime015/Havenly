import CarouselCard from "@/components/CarrouselCard";
import FeaturedCard from "@/components/FeaturedCard";
import PropertyCard from "@/components/PropertyCard";
import TabScreenBackground from "@/components/TabScreenBackground";
import { supabase } from "@/lib/supabase";
import { Property } from "@/types";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [featured, setFeatured] = useState<Property[]>([]);
  const [recommended, setRecommended] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchProperties();
    }, []),
  );

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data: featuredData, error: featuredError } = await supabase
        .from("properties")
        .select("*")
        .eq("is_featured", true)
        .order("created_at", { ascending: false });

      if (featuredError) console.error(featuredError);

      const { data: recommendedData, error: recommendedError } = await supabase
        .from("properties")
        .select("*")
        .eq("is_featured", false)
        .order("created_at", { ascending: false });

      if (recommendedError) console.error(recommendedError);

      setFeatured(featuredData ?? []);
      setRecommended(recommendedData ?? []);
    } catch (error) {
      console.error("Error loading properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const allProperties = [...featured, ...recommended];

  const carouselData = allProperties
    .filter((prop) => Array.isArray(prop.images) && prop.images.length > 0)
    .map((prop) => ({
      id: prop.id,
      image: prop.images[0],
      title: prop.title || "Propriété",
      price: prop.price || 0,
      type: prop.type || "Non défini",
    }));

  return (
    <View className="flex-1 bg-background">
      {/* MODIFICATION ICI : 
        Enveloppé dans une View absolue avec 'top-12' (environ 48px) pour descendre tout l'arrière-plan.
        Vous pouvez ajuster cette valeur (ex: top-10, top-16, top-20) selon vos besoins.
      */}
      <View className="absolute top-20 left-0 right-0" pointerEvents="none">
        <TabScreenBackground />
      </View>

      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        <FlatList
          data={recommended}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 120,
          }}
          ListHeaderComponent={
            <View className="pt-2">
              <View className="mb-4">
                <CarouselCard data={carouselData} />
              </View>

              <View className="mb-6">
                <Text className="px-5 mb-4 text-lg font-bold text-card-foreground">
                  Featured
                </Text>

                {loading ? (
                  <ActivityIndicator
                    size="small"
                    color="#2563EB"
                    className="py-10"
                  />
                ) : (
                  <FlatList
                    horizontal
                    data={featured}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <FeaturedCard property={item} />}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                      paddingHorizontal: 20,
                    }}
                  />
                )}
              </View>

              <Text className="px-5 mb-4 text-lg font-bold text-card-foreground">
                Recommended
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View className="mb-1">
              <View className="px-5">
                <PropertyCard property={item} />
              </View>
            </View>
          )}
          ListEmptyComponent={
            !loading ? (
              <View className="items-center py-10">
                <Text className="text-gray-400">No properties found</Text>
              </View>
            ) : null
          }
        />
      </SafeAreaView>
    </View>
  );
}
