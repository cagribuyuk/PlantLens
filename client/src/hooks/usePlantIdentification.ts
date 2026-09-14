import {
  useMutation,
} from '@tanstack/react-query';

import {
  identifyPlant,
} from '../services/plantNetService';

import {
  AppError,
} from '../errors/AppError';

import {
  IdentifyPlantRequest,
  PlantNetResponse,
} from '../types/plant';

export function usePlantIdentification() {
  return useMutation<
    PlantNetResponse,
    AppError,
    IdentifyPlantRequest
  >({
    mutationFn:
      identifyPlant,

    retry: false,
  });
}