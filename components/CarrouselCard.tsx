import React, { useState } from "react";
import { Dimensions, Image, Text, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const { width } = Dimensions.get("window");

const CARD_WIDTH = width;
const CARD_HEIGHT = 240;

// CORRECTION : Ajout d'un id unique pour stabiliser la liste
export interface CarouselItemData {
  id: string;
  image: string;
  title: string;
  price: number | string;
  type: string;
}

interface CarouselCardProps {
  data: CarouselItemData[];
}

export default function CarouselCard({ data }: CarouselCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!data?.length) return null;

  return (
    <View className="items-center w-full bg-transparent">
      <Carousel
        loop
        autoPlay
        autoPlayInterval={4000}
        pagingEnabled
        snapEnabled
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        data={data}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.94,
          parallaxScrollingOffset: 45,
        }}
        onSnapToItem={(index) => setActiveIndex(index)}
        renderItem={({ item }) => (
          <View className="mx-3 flex-1 overflow-hidden rounded-[24px] bg-transparent shadow-md">
            {/* Image principale */}
            <Image
              source={{ uri: item.image }}
              resizeMode="cover"
              className="absolute h-full w-full"
            />

            {/* 1. Badge du Type (Haut - Gauche) */}
            <View className="absolute top-5 left-5 bg-white/95 px-3 py-1 rounded-full shadow-sm">
              <Text className="text-[11px] font-extrabold text-blue-600 uppercase tracking-wider">
                {item.type}
              </Text>
            </View>

            {/* 2. Conteneur d'informations Flottant (Bas) */}
            <View className="absolute bottom-3 left-3 right-3 bg-slate-950/75 border border-white/10 p-3.5 rounded-2xl shadow-lg">
              <View className="flex-row items-center justify-between">
                {/* Titre & Sous-titre */}
                <View className="flex-1 pr-3">
                  <Text
                    className="text-base font-bold text-white tracking-wide"
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <Text className="text-xs text-gray-300 mt-0.5 font-medium">
                    📍 Vue d'ensemble
                  </Text>
                </View>

                {/* Étiquette de Prix Stylisée */}
                <View className="bg-blue-500/20 border border-blue-400/40 px-3 py-1.5 rounded-xl items-center justify-center">
                  <Text className="text-base font-black text-blue-400">
                    {typeof item.price === "number"
                      ? `${item.price.toLocaleString("fr-FR")} $`
                      : item.price}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
      />

      {/* 3. Indicateurs de pagination modernes */}
      <View className="mt-1 flex-row items-center justify-center">
        {data.map((item, index) => {
          const isActive = activeIndex === index;
          return (
            <View
              key={item.id} // CORRECTION : Utilisation de l'ID unique au lieu de l'index
              className={`mx-1 h-1.5 rounded-full transition-all duration-300 ${
                isActive ? "w-5 bg-blue-600" : "w-1.5 bg-gray-300"
              }`}
            />
          );
        })}
      </View>
    </View>
  );
}
