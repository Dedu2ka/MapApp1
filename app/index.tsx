import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Map from "../components/Map";// Импортируем компонент карты, который отображает маркеры
import MarkerDetailsScreen from "./marker/[id]";// Импортируем экран с деталями маркера
import { MarkerItem } from "../types";// Импортируем типы для маркеров

export default function MapScreen() {// Главный компонент экрана с картой
  // Состояние для хранения всех маркеров
  const [markers, setMarkers] = useState<MarkerItem[]>([]);
  // Состояние для хранения выбранного маркера
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);

  // Состояние для хранения текущего региона карты
  const [mapRegion, setMapRegion] = useState({
    latitude: 55.7558,
    longitude: 37.6173,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  // Находим объект выбранного маркера
  const selectedMarker = markers.find((m) => m.id === selectedMarkerId) || undefined;

  return (
    // Контейнер для всего экрана
    <View style={styles.container}>
      {/* Если выбран маркер и он существует, показываем экран деталей */}
      {selectedMarkerId && selectedMarker ? (
        <MarkerDetailsScreen
          marker={selectedMarker} // Передаем выбранный маркер
          markers={markers} // Передаем весь список маркеров
          setMarkers={setMarkers} // Передаем функцию обновления маркеров
          onClose={() => setSelectedMarkerId(null)} // Закрытие деталей маркера — просто сбрасываем выбранный id
        />
      ) : (
        // Иначе отображаем карту
        <Map
          markers={markers}// Передаем список маркеров
          setMarkers={setMarkers}// Передаем функцию для добавления/обновления маркеров
          onMarkerPress={(id: string) => setSelectedMarkerId(id)}//При нажатии на марке сохраняем id
          region={mapRegion} // Передаем текущий регион карты
          onRegionChangeComplete={(region) => setMapRegion(region)} // Обновляем регион при перемещении
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});