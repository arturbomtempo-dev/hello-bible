export interface BibleTextFetcher {
    fetchVerseText(apiReference: string): Promise<string>;
}

interface BibleApiResponse {
    text?: string;
}

export class BibleApiClient implements BibleTextFetcher {
    private static readonly baseUrl = 'https://bible-api.com';
    private static readonly translation = 'almeida';

    async fetchVerseText(apiReference: string): Promise<string> {
        const url = `${BibleApiClient.baseUrl}/${encodeURIComponent(apiReference)}?translation=${BibleApiClient.translation}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Bible API request failed with status ${response.status}`);
        }

        const data = (await response.json()) as BibleApiResponse;

        if (!data.text) {
            throw new Error('Bible API response did not include verse text');
        }

        return data.text.trim().replace(/\s+/g, ' ');
    }
}
