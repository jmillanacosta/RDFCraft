'use client';

import { MappingDocument, MappingModel } from '@/lib/models/MappingModel';
import { ApiCallResponse, callApi } from '../ApiCall';

class MappingService {
  static async saveMapping(
    mappingId: string,
    mapping: Partial<MappingModel>,
  ): Promise<ApiCallResponse<MappingDocument>> {
    return await callApi<MappingDocument>({
      endpoint: `/api/mappings/${mappingId}/save`,
      body: mapping,
      method: 'POST',
    });
  }
}

export default MappingService;
