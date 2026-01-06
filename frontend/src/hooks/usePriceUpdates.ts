import { useEffect, useRef, useCallback } from 'react';
import { PriceUpdate } from '../types';

const WS_URL = 'ws://localhost:8080/ws/prices';

export const usePriceUpdates = (onUpdate: (update: PriceUpdate) => void) => {
    const ws = useRef<WebSocket | null>(null);
    const reconnectTimeout = useRef<NodeJS.Timeout>();

    const connect = useCallback(() => {
        try {
            ws.current = new WebSocket(WS_URL);

            ws.current.onopen = () => {
                console.log('WebSocket connected');
            };

            ws.current.onmessage = (event) => {
                try {
                    const update: PriceUpdate = JSON.parse(event.data);
                    onUpdate(update);
                } catch (error) {
                    console.error('Failed to parse price update:', error);
                }
            };

            ws.current.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            ws.current.onclose = () => {
                console.log('WebSocket disconnected, reconnecting...');
                reconnectTimeout.current = setTimeout(connect, 3000);
            };
        } catch (error) {
            console.error('Failed to connect WebSocket:', error);
            reconnectTimeout.current = setTimeout(connect, 3000);
        }
    }, [onUpdate]);

    useEffect(() => {
        connect();

        return () => {
            if (reconnectTimeout.current) {
                clearTimeout(reconnectTimeout.current);
            }
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [connect]);

    return ws.current;
};
