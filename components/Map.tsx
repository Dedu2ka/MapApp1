import React, { useState } from "react";
import { View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker as MapMarker } from "react-native-maps";
import { MarkerItem } from "../types";

export default function Map({
  markers,
  setMarkers,
  onMarkerPress,
  region, // Controlled region из родителя
  onRegionChangeComplete, // Callback для обновления региона в родителе
}: {
  markers: MarkerItem[];
  setMarkers: React.Dispatch<React.SetStateAction<MarkerItem[]>>;
  onMarkerPress: (id: string) => void;
  region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  onRegionChangeComplete: (region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }) => void;
}) {
  const [mapReady, setMapReady] = useState(false);

  // Генератор id для маркеров
  const generateId = () =>
    Date.now().toString() + Math.random().toString(36).substring(2);

  // Обработка долгого нажатия для добавления маркера
  const handleLongPress = (event: any) => {
    try {
      const { latitude, longitude } = event.nativeEvent.coordinate;
      const newMarker: MarkerItem = {
        id: generateId(),
        latitude,
        longitude,
        images: [],
      };
      setMarkers([...markers, newMarker]);
    } catch {
      Alert.alert("Ошибка", "Не удалось добавить маркер");
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region} // controlled region, чтобы карта не сбрасывалась
        onRegionChangeComplete={onRegionChangeComplete} // обновляем регион в родителе
        onLongPress={handleLongPress}
        onMapReady={() => setMapReady(true)}
      >
        {markers.map((marker) => (
          <MapMarker
            key={marker.id}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            onPress={() => onMarkerPress(marker.id)}
          />
        ))}
      </MapView>

      {!mapReady && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#1E90FF" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.5)",
  },
});