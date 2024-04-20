export interface Settings {
    masterServerIp: string;
    masterServerPort: number;
    serverIp: string;
    serverPort: number;
    channel: string;
    encryptionKey: string;
    excludePasswords: boolean;
}

export function isSettings(data: unknown): data is Settings {
    let valid = true;
    valid &&= (data as Settings).encryptionKey !== undefined;
    valid &&= (data as Settings).masterServerIp !== undefined;
    valid &&= (data as Settings).masterServerPort !== undefined;
    valid &&= (data as Settings).serverIp !== undefined;
    valid &&= (data as Settings).serverPort !== undefined;
    valid &&= (data as Settings).channel !== undefined;
    valid &&= (data as Settings).excludePasswords !== undefined;
    return valid;
}
