export interface IHttpClient {
  post<T>(url: string, body: unknown): Promise<T>;
}

export class HttpClient implements IHttpClient {
  async post<T>(url: string, body: unknown): Promise<T> {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error('Request failed');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return res.json();
  }
}
