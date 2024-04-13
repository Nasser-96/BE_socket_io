export class Room {
  roomId: string;
  roomTitle: string;
  namespaceId: string;
  privateRoom: boolean;
  history: string[];

  constructor(
    roomId,
    roomTitle,
    namespaceId,
    privateRoom = false,
    history = [],
  ) {
    this.roomId = roomId;
    this.roomTitle = roomTitle;
    this.namespaceId = namespaceId;
    this.privateRoom = privateRoom;
    this.history = history;
  }

  addMessage(message) {
    this.history.push(message);
  }

  clearHistory() {
    this.history = [];
  }
}
