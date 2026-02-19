import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Map from "../components/Map";
import MarkerDetailsScreen from "./marker/[id]";
import { MarkerItem } from "../types";

export default function MapScreen() {
  const [markers, setMarkers] = useState<MarkerItem[]>([]);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);

  const selectedMarker = markers.find((m) => m.id === selectedMarkerId) || undefined;

  return (
    <View style={styles.container}>
      {selectedMarkerId && selectedMarker ? (
        <MarkerDetailsScreen
          marker={selectedMarker}
          markers={markers}
          setMarkers={setMarkers}
          onClose={() => setSelectedMarkerId(null)}
        />
      ) : (
        <Map
          markers={markers}
          setMarkers={setMarkers}
          onMarkerPress={(id: string) => setSelectedMarkerId(id)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
