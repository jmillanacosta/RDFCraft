'use client';

import {
  OntologyClassDocument,
  OntologyIndividualModel,
  OntologyPropertyDocument,
} from '@/lib/models/OntologyIndexModel';
import { ApiCallResponse, callApi } from '../ApiCall';
import { OntologyModel } from '@/lib/models/OntologyModel';

class OntologyService {
  static async getOntology(
    id: string,
  ): Promise<ApiCallResponse<OntologyModel>> {
    return await callApi<OntologyModel>({
      endpoint: `/api/ontologies/${id}`,
    });
  }

  static async getClasses(
    id: string,
  ): Promise<ApiCallResponse<OntologyClassDocument[]>> {
    return await callApi<OntologyClassDocument[]>({
      endpoint: `/api/ontologies/${id}/classes`,
    });
  }

  static async getProperties(
    id: string,
  ): Promise<ApiCallResponse<OntologyPropertyDocument[]>> {
    return await callApi<OntologyPropertyDocument[]>({
      endpoint: `/api/ontologies/${id}/properties`,
    });
  }

  static async getIndividuals(
    id: string,
  ): Promise<ApiCallResponse<OntologyIndividualModel[]>> {
    return await callApi<OntologyIndividualModel[]>({
      endpoint: `/api/ontologies/${id}/individuals`,
    });
  }
}

export default OntologyService;
