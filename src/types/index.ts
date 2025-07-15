export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  text: string;
  image?: string;
}

export interface TarotCard {
  id: number;
  name: string;
  image: string;
  shortMeaning: string;
}

export interface FormData {
  name: string;
  birthdate: string;
  question: string;
  phone: string;
  consent: boolean;
}