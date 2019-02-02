export interface ClientOptions {
    isPlaying: boolean;
    /** The id used to identify the client. */
    id: string;
    /**
     * The id of the room that the user wants to join if we want to join a specific one. If ommitted,
     * the user will join the first available room.
     */
    roomToJoin?: string;
}
