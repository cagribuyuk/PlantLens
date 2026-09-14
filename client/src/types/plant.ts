export type PlantOrgan =
  | 'auto'
  | 'leaf'
  | 'flower'
  | 'fruit'
  | 'bark';

export interface PlantImage {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
  base64?: string | null;
}

export interface PlantSpeciesInfo {
  scientificNameWithoutAuthor: string;
  scientificNameAuthorship: string;
  scientificName: string;

  commonNames: string[];

  genus: {
    scientificName: string;
    scientificNameWithoutAuthor: string;
  };

  family: {
    scientificName: string;
    scientificNameWithoutAuthor: string;
  };
}

export interface PlantPrediction {
  score: number;
  species: PlantSpeciesInfo;
}

export interface PlantNetResponse {
  bestMatch: string;
  results: PlantPrediction[];

  predictedOrgans?: {
    image: string;
    filename: string;
    organ: string;
    score: number;
  }[];

  version: string;
  remainingIdentificationRequests?: number;
}

export interface IdentifyPlantRequest {
  image: PlantImage;
  organ: PlantOrgan;
}