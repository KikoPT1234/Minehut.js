import { SessionServer } from "../classes/Server";
import Collection from "@discordjs/collection";
import { Session } from "../classes/Session";

export interface UserDictionary {
    [key: string]: any
    session: Session
    id: string
    email: string
    emailVerified: boolean
    emailSentAt: number
    v: number
    emailCode: string
    credits: number
    lastLogin: number
    lastPasswordChange?: number
    minecraft?: {
        linkCode: string
        lastLinkTime: number
        username: string
        uuid: string
    }
    maxServers: number
    serverIds: string[]
    servers?: Collection<string, SessionServer>
    transactions: Collection<string, {[key: string]: any}>
    payments: Collection<string, {[key: string]: any}>
}