


export type ServerMessage = {
    createdAt: number;
    channelId: string;
    ipAddress?: string;
    message: string;
}

export const serverMessagesDecode = (data: string): ServerMessage[] => {
    return JSON.parse(data);
}

export const serverMessageEncode = (data: ServerMessage[]): string => {
    return JSON.stringify(data);
}
