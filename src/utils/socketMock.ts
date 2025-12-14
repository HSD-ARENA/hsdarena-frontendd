// utils/socketMock.ts
export function simulateEvent(socket: any, event: string, payload: any) {
    console.log(`Simulating event: ${event}`, payload);
    socket?._callbacks?.[`$${event}`]?.forEach((cb: any) => cb(payload));
}
