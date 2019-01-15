export interface ClientOptions {
    isPlaying: boolean;
    /** The id that is used in the game state for the given player. It only has a value if the user is playing.*/
    playerId?: string;
    /**
     * The id of the room that the user wants to join if we want to join a specific one. If ommitted,
     * the user will join the first available room.
     */
    roomToJoin?: string;
}
