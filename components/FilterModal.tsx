import { PropertyType, useFilterStore } from "@/store/filterStore";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme, // Importation pour gérer les propriétés non-CSS (icônes, placeholders)
} from "react-native";

const TYPES: { label: string; value: PropertyType }[] = [
  { label: "All", value: null },
  { label: "Apartment", value: "apartment" },
  { label: "House", value: "house" },
  { label: "Villa", value: "villa" },
  { label: "Studio", value: "studio" },
];

const BEDS = [
  { label: "Any", value: null },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4+", value: 4 },
];

const PRICE_PRESETS = [
  { label: "Under ₹50L", min: null, max: 5000000 },
  { label: "₹50L – ₹1Cr", min: 5000000, max: 10000000 },
  { label: "₹1Cr – ₹2Cr", min: 10000000, max: 20000000 },
  { label: "Above ₹2Cr", min: 20000000, max: null },
];

// Boutons/Chips dynamiques adaptés au thème global
const chip = (active: boolean) =>
  `px-4 py-2 rounded-full border ${
    active ? "bg-primary border-primary" : "bg-card border-border"
  }`;

const chipText = (active: boolean) =>
  `text-sm font-semibold ${active ? "text-primary-foreground" : "text-muted-foreground"}`;

export default function FilterModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Correspondances de couleurs pour les composants natifs (Icones et Placeholders)
  const iconColor = isDark ? "#def0fa" : "#13232c"; // Basé sur votre variable --foreground
  const placeholderColor = isDark ? "#FFF" : "#9CA3AF";

  const {
    type,
    bedrooms,
    minPrice,
    maxPrice,
    setType,
    setBedrooms,
    setMinPrice,
    setMaxPrice,
    resetFilters,
  } = useFilterStore();

  const [localMin, setLocalMin] = useState(minPrice ? String(minPrice) : "");
  const [localMax, setLocalMax] = useState(maxPrice ? String(maxPrice) : "");

  const activeCount = [type, bedrooms, minPrice, maxPrice].filter(
    (v) => v !== null,
  ).length;

  const handleApply = () => {
    setMinPrice(localMin ? Number(localMin) : null);
    setMaxPrice(localMax ? Number(localMax) : null);
    onClose();
  };

  const handleReset = () => {
    setLocalMin("");
    setLocalMax("");
    resetFilters();
    onClose();
  };

  const shadow = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: isDark ? 0.2 : 0.04,
    shadowRadius: 4,
    elevation: 1,
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-6 pb-4 bg-card border-b border-border">
          <TouchableOpacity onPress={onClose} className="p-1">
            <Ionicons name="close" size={22} color={iconColor} />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-card-foreground">
            Filters
          </Text>
          <TouchableOpacity onPress={handleReset}>
            <Text className="text-card-foreground font-semibold text-sm">
              Reset
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Property Type */}
          <Text className="text-2xl font-bold text-card-foreground mb-3">
            Property Type
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-6">
            {TYPES.map((item) => {
              const isActive = type === item.value;
              return (
                <TouchableOpacity
                  key={String(item.value)}
                  onPress={() => setType(item.value)}
                  className={`flex-1 items-center py-3 rounded-2xl border ${
                    isActive
                      ? "bg-primary border-primary"
                      : "bg-card border-border"
                  }`}
                  style={shadow}
                >
                  <Text
                    className={`text-xs font-bold ${
                      isActive ? "text-card" : "text-card-foreground"
                    }`}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Bedrooms */}
          <Text className="text-2xl font-bold text-card-foreground mb-3">
            Bedrooms
          </Text>
          <View className="flex-row gap-2 mb-6">
            {BEDS.map((item) => (
              <TouchableOpacity
                key={String(item.value)}
                onPress={() => setBedrooms(item.value)}
                className={`flex-1 items-center py-3 rounded-2xl border ${
                  bedrooms === item.value
                    ? "bg-primary border-primary"
                    : "bg-card border-border"
                }`}
                style={shadow}
              >
                <Text
                  className={`text-lg font-bold ${
                    bedrooms === item.value
                      ? "text-card"
                      : "text-card-foreground"
                  }`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Price Range */}
          <Text className="text-2xl font-bold text-card-foreground mb-3">
            Price Range (₹)
          </Text>
          <View className="flex-row gap-3 mb-3">
            {[
              {
                label: "Min Price",
                value: localMin,
                onChange: setLocalMin,
                placeholder: "0",
              },
              {
                label: "Max Price",
                value: localMax,
                onChange: setLocalMax,
                placeholder: "Any",
              },
            ].map(({ label, value, onChange, placeholder }) => (
              <View key={label} className="flex-1 ">
                <Text className="text-sm text-card-foreground mb-2 font-medium">
                  {label}
                </Text>
                <View
                  className="flex-row items-center bg-card rounded-2xl px-3 border border-border"
                  style={shadow}
                >
                  <Text className="text-card-foreground text-sm mr-1">₹</Text>
                  <TextInput
                    className="flex-1  -top-0.75 py-3 text-card-foreground"
                    placeholder={placeholder}
                    placeholderTextColor={placeholderColor}
                    keyboardType="numeric"
                    value={value}
                    onChangeText={onChange}
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Price Presets */}
          <View className="flex-row flex-wrap gap-2">
            {PRICE_PRESETS.map((p) => {
              const active = minPrice === p.min && maxPrice === p.max;
              return (
                <TouchableOpacity
                  key={p.label}
                  onPress={() => {
                    setLocalMin(p.min ? String(p.min) : "");
                    setLocalMax(p.max ? String(p.max) : "");
                    setMinPrice(p.min);
                    setMaxPrice(p.max);
                  }}
                  className={`px-3 py-1.5 rounded-full border ${
                    active
                      ? "bg-secondary border-primary"
                      : "bg-card border-border"
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      active ? "text-card-foreground" : "text-card-foreground"
                    }`}
                  >
                    {p.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Apply Button */}
        <View className="px-5 pb-8 pt-4 bg-card border-t border-border">
          <TouchableOpacity
            onPress={handleApply}
            className="bg-primary rounded-2xl py-4 items-center"
            style={{
              shadowColor: isDark ? "#000" : "#2563EB",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text className="text-card font-bold text-lg">
              Apply Filters{activeCount > 0 ? ` (${activeCount})` : ""}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
