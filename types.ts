export interface ImageItem {//Модель фото
  id: string;
  uri: string;
}

export interface MarkerItem {//Модель 
  id: string;
  latitude: number;
  longitude: number;
  images: ImageItem[];
}
