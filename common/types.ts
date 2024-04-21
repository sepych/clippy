


export type ServerMessage = {
    createdAt: number;
    ipAddress?: string;
    message: string | null;
}

export const serverMessagesDecode = (data: string): ServerMessage[] => {
    return JSON.parse(data);
}

export const serverMessageEncode = (data: ServerMessage[]): string => {
    return JSON.stringify(data);
}
