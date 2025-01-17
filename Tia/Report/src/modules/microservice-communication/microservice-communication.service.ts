export class MicroserviceCommunicationService {
  async fetchFullData(accountId: string): Promise<any[]> {
    const fetch = (await import('node-fetch')).default;
    const url = `http://localhost:5001/income/account/${accountId}`;

    try {
      const response = await fetch(url, { method: 'GET' });

      if (!response.ok) {
        console.error(
          `HTTP Error: ${response.status} - ${response.statusText}`,
        );
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        console.error(
          `Invalid response type: Expected an array but got ${typeof data}`,
        );
        throw new Error(`Expected an array but got ${typeof data}`);
      }

      return data;
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  }

  async fetchMonthlyData(
    accountId: string,
    year: number,
    month: number,
  ): Promise<any[]> {
    const fetch = (await import('node-fetch')).default;
    const url = `http://localhost:5001/income/account/${accountId}/date/${year}-${String(month).padStart(2, '0')}`;

    try {
      const response = await fetch(url, { method: 'GET' });

      if (!response.ok) {
        console.error(
          `HTTP Error: ${response.status} - ${response.statusText}`,
        );
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        console.error(
          `Invalid response type: Expected an array but got ${typeof data}`,
        );
        throw new Error(`Expected an array but got ${typeof data}`);
      }

      return data;
    } catch (error) {
      console.error(`Error fetching data`, error);
      throw new Error(`Error fetching data: ${error.message}`);
    }
  }
}
