export async function parseJson<T>(resp: Response): Promise<T> {
    return (await resp.json()) as T;
}
