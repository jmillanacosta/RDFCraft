'use client';

import { CompleteMapping } from '@/lib/models/CompleteMappingModel';
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
  static async completeMapping(
    workspaceId: string,
    mappingId: string,
  ): Promise<ApiCallResponse<CompleteMapping>> {
    return await callApi<CompleteMapping>({
      endpoint: `/api/complete-mapping/${workspaceId}/${mappingId}`,
      method: 'GET',
    });
  }
}

export default MappingService;
