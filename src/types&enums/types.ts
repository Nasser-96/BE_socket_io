import { Socket } from "socket.io"

export type AuthPayloadType = 
{
    username:string
    id:string
}

export type SocketWithAuth = Socket & AuthPayloadType