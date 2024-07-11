export type TSelectedFacility = {
  id: Facility["id"];
  type: FacilityType;
};

export type TLocationFacility = {
  id: Facility["id"];
  type: FacilityType;
  latitude: number;
  longitude: number;
};

export const FacilityTypes = [
  "school",
  "kindergarden",
  "school_social_work",
  "youth_vocational_assistance",
] as const;

export type FacilityType = (typeof FacilityTypes)[number];

export type Facility =
  | School
  | Kindergarden
  | SchoolSocialWork
  | YouthVocationalAssistance;

export type Facilities = {
  school: School[];
  kindergarden: Kindergarden[];
  youth_vocational_assistance: YouthVocationalAssistance[];
  school_social_work: SchoolSocialWork[];
};

export interface School {
  id: number; // ID
  type: "school";
  category: string; // ART
  category_code?: string | null; // TYP
  name: string; // BEZEICHNUNG
  short_name: string; // KURZBEZEICHNUNG
  additional_name?: string | null; // BEZEICHNUNGZUSATZ
  street: string; // STRASSE
  postal_code: string; // PLZ
  city: string; // ORT
  phone: string; // TELEFON
  fax?: string | null; // FAX
  email?: string | null; // EMAIL
  website?: string | null; // WWW
  sponsor?: string | null; // TRAEGER
  sponsor_code?: number | null; // TRAEGERTYP
  latitude: number;
  longitude: number;
  is_favorite: boolean | null;
}

export interface Kindergarden {
  id: number; // ID
  type: "kindergarden";
  sponsor?: string | null; // TRAEGER
  name?: string | null; // BEZEICHNUNG
  short_name?: string | null; // KURZBEZEICHNUNG
  street?: string | null; // STRASSE
  house_number?: string | null; // HAUSBEZ
  postal_code?: string | null; // PLZ
  city?: string | null; // ORT
  url?: string | null; // URL
  phone?: string | null; // TELEFON
  fax?: string | null; // FAX
  email?: string | null; // EMAIL
  latitude: number;
  longitude: number;
  is_favorite: boolean | null;
}

export interface SchoolSocialWork {
  id: number; // ID
  type: "school_social_work";
  sponsor?: string | null; // TRAEGER
  services?: string | null; // LEISTUNGEN
  street: string; // STRASSE
  postal_code: string; // PLZ
  city: string; // ORT
  phone?: string | null; // TELEFON
  fax?: string | null; // FAX
  email?: string | null; // EMAIL
  website?: string | null; // WWW
  latitude: number;
  longitude: number;
  is_favorite: boolean | null;
}

export interface YouthVocationalAssistance {
  id: number; // ID
  type: "youth_vocational_assistance";
  sponsor?: string | null; // TRAEGER
  services?: string | null; // LEISTUNGEN
  street: string; // STRASSE
  postal_code: string; // PLZ
  city: string; // ORT
  phone?: string | null; // TELEFON
  fax?: string | null; // FAX
  email?: string | null; // EMAIL
  website?: string | null; // WWW
  latitude: number;
  longitude: number;
  is_favorite: boolean | null;
}
