import React, { useState } from "react";
/* Импорт реакта(реакт это библа которая обновляет состояние UI компонентов сразу как  старое поменлось) 
делается это через сравнение старого и нового состояния и изменение тока того что имзменилось, так называеый Virtual DOM
и импортируем хук "useState", хук это способ дать память и реагирование на изменение компонентам, useState - хук для хранения состояния внутри компонента*/
import {
  View,//Контейнер
  Text,//Текстовый компонент
  Button,//Кнопка
  StyleSheet,//Создание стилей
  Alert,//Всплывающее окно предупреждения
  ScrollView,//Прокручиваемый контейнер
  Modal,//Модальное окно
  Image,//Компонент для отображения 
  TouchableOpacity,//Создание нажатий
} from "react-native";/*импортируем компоненты из реакт натив, фрэймворк на реакте для мобилок, 
отличие что компоненты нативные, те. реально существуют в системе, мы обращаемся и работаем с элеметами которые уже есть в android*/
import * as ImagePicker from "expo-image-picker";//Импорт для ImagePicker для выбора изображений из галереи
import { MarkerItem } from "../../types";//Импортируем тип 

export default function MarkerDetailsScreen({//Экспортируем основной компонент экрана с деталями маркеров
  marker, //текущий маркер
  markers, //Массив всех маркеров
  setMarkers, //Функция обновления массива маркеров
  onClose, //Функция закрытия экрана
}: {
  marker: MarkerItem; //Тип маркера
  markers: MarkerItem[]; //Массив элемент - тип маркера
  setMarkers: React.Dispatch<React.SetStateAction<MarkerItem[]>>;//Тип функции изменяющий список маркеров
  onClose: () => void;//Тип ничего не возвращает, не принимает
}) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);//Состояние для предпросмотра изображения previewImage - состояние, 2 - элемент функция,string если есть, либо null

  const generateId = () =>
    Date.now().toString() + Math.random().toString(36).substring(2);//Функция для генерации уникального id

  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();//Запрашиваем разрешение на доступ в галерею
      if (!permission.granted) {//Если разрешение не получено
        Alert.alert("Ошибка", "Нет доступа к галерее");//Вывести сообщение об ошибке
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({//Открываем галерею
        mediaTypes: ImagePicker.MediaTypeOptions.Images,//Выбираем только изображения
        quality: 0.7,//Качество 70%
      });
      if (!result.canceled && result.assets.length > 0) {//Если выбор не отменён и есть файл
        const newImages = [...marker.images, { id: generateId(), uri: result.assets[0].uri }];//Создаем новый массив изображений старый + новый
        const updatedMarker = { ...marker, images: newImages };//Создаем обновленный маркер
        setMarkers(markers.map((m) => (m.id === marker.id ? updatedMarker : m)));//Обновляем массив с маркерами
      }
    } catch {
      Alert.alert("Ошибка", "Не удалось выбрать изображение");//Обработка исключений
    }
  };

  const deleteMarker = () => {
    Alert.alert("Удалить маркер?", "Вы точно хотите удалить этот маркер?", [//Предупреждение системы
      { text: "Отмена", style: "cancel" },//Кнопка отмены
      {
        text: "Удалить",
        style: "destructive",
        onPress: () => {
          setMarkers(markers.filter((m) => m.id !== marker.id));//Удаляем из массива
          onClose();//Закрываем экран
        },
      },
    ]);
  };

  const deleteImage = (imageId: string) => {//Удаление Изображения 
    const newImages = marker.images.filter((img) => img.id !== imageId);//Фильтруем изображения исключаем удаляемое
    const updatedMarker = { ...marker, images: newImages };//Новый маркер
    setMarkers(markers.map((m) => (m.id === marker.id ? updatedMarker : m)));//Обновляем массив маркеров
  };

  return (//JSX разметка
    <View style={styles.container}>{/* Основной контейнер */}
      {/* Шапка */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Информация о маркере</Text>
      </View>

      {/* Прокручиваемый контент */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.coords}>Широта: {marker.latitude.toFixed(6)}</Text>
        <Text style={styles.coords}>Долгота: {marker.longitude.toFixed(6)}</Text>

        <Button title="Добавить изображение" onPress={pickImage} />

        {marker.images.length === 0 ? (<Text style={styles.noImages}>Нет изображений</Text>) : (
          // Если изображения есть — отображаем список
          marker.images.map((img) => (
            <TouchableOpacity
              key={img.id} // Уникальный ключ
              onPress={() => setPreviewImage(img.uri)}//Превью
              style={styles.imageContainer}
            >
              <Image source={{ uri: img.uri }} style={styles.image} />{/* само изображение */}
              <Button title="Удалить" color="red" onPress={() => deleteImage(img.id)} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <View style={styles.footer}>{/* Подвал */}
        <View style={{ marginBottom: 10 }}>
          <Button title="Удалить маркер" color="red" onPress={deleteMarker} />
        </View>
        <Button title="Назад" onPress={onClose} />
      </View>

      {/* Модальное окно для просмотра изображения */}
      <Modal visible={!!previewImage} transparent={true}>
        <View style={styles.modalBackground}>
          {/* Изображение для предпросмотра */}
          <Image source={{ uri: previewImage || "" }} style={styles.previewImage} />
          {/* Кнопка закрытия модального окна */}
          <Button title="Закрыть" onPress={() => setPreviewImage(null)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },//Весь экран черный
  header: { padding: 16, backgroundColor: "black", alignItems: "center" },//16 отступы внутри, центрирование по центру
  headerText: { color: "white", fontSize: 18, fontWeight: "bold" },//белый цвет, 18 - размер, жирный
  scrollContent: { padding: 16, paddingBottom: 100 },//доп отступ снизу 100
  coords: { fontSize: 16, marginBottom: 8, color: "white", fontWeight: "bold" },//внешний отступ снизу 8
  footer: { padding: 16, backgroundColor: "black" },
  imageContainer: { marginVertical: 10 },// Отступ сверху и снизу 10
  image: { width: "100%", height: 200, borderRadius: 8 },
  noImages: { textAlign: "center", marginTop: 20, color: "gray" },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: { width: "90%", height: "70%", borderRadius: 12, resizeMode: "contain" },
});
