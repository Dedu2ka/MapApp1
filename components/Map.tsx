import React, { useState } from "react";
import { View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker as MapMarker } from "react-native-maps";
import { MarkerItem } from "../types";

export default function Map({
  markers,
  setMarkers,
  onMarkerPress,
}: {
  markers: MarkerItem[];
  setMarkers: React.Dispatch<React.SetStateAction<MarkerItem[]>>;
  onMarkerPress: (id: string) => void;
}) {
  const [mapReady, setMapReady] = useState(false);

  const generateId = () =>
    Date.now().toString() + Math.random().toString(36).substring(2);

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
        initialRegion={{
          latitude: 55.7558,
          longitude: 37.6173,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
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
