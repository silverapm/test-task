export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function msUntil(isoDateTime: string): number {
    const target = new Date(isoDateTime).getTime();
    const now = Date.now();
    return Math.max(0, target - now);
}

export async function sleepUntil(isoDateTime: string): Promise<void> {
    await sleep(msUntil(isoDateTime));
}
