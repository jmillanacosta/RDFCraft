import encodeFileToBase64 from '../../../utils/base64encoder';
import ApiService from '../../services/api_service';
import { Ontology } from './types';

class OntologyApi {
  private static getApiClient(): ApiService {
    return ApiService.getInstance('default');
  }

  public static async getOntologiesInWorkspace(
    workspaceUuid: string,
  ): Promise<Ontology[]> {
    const result = await this.getApiClient().callApi<Ontology[]>(
      `/workspaces/${workspaceUuid}/ontology`,
      {
        method: 'GET',
        parser: data => data as Ontology[],
      },
    );

    if (result.type === 'success') {
      return result.data;
    }

    throw new Error(
      `Failed to get ontologies: ${result.message} (status: ${result.status})`,
    );
  }

  public static async createOntologyInWorkspace(
    workspaceUuid: string,
    name: string,
    description: string,
    baseUri: string,
    file: File,
  ): Promise<boolean> {
    const base64EncodedFile = await encodeFileToBase64(file);
    const data = {
      name,
      description,
      base_uri: baseUri,
      content: base64EncodedFile,
    };

    const result = await this.getApiClient().callApi<boolean>(
      `/workspaces/${workspaceUuid}/ontology`,
      {
        method: 'POST',
        body: data,
        parser: () => true,
      },
    );

    if (result.type === 'success') {
      return result.data;
    }

    throw new Error(
      `Failed to create ontology: ${result.message} (status: ${result.status})`,
    );
  }

  public static async deleteOntologyInWorkspace(
    workspaceUuid: string,
    ontologyUuid: string,
  ): Promise<boolean> {
    const result = await this.getApiClient().callApi<boolean>(
      `/workspaces/${workspaceUuid}/ontology/${ontologyUuid}`,
      {
        method: 'DELETE',
        parser: () => true,
      },
    );

    if (result.type === 'success') {
      return result.data;
    }

    throw new Error(
      `Failed to delete ontology: ${result.message} (status: ${result.status})`,
    );
  }
}

export default OntologyApi;
