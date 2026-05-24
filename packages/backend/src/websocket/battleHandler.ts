import { Socket, Server as SocketIOServer } from 'socket.io';

export const initBattleHandler = (socket: Socket, io: SocketIOServer) => {
  /**
   * Player joins a battle queue
   */
  socket.on('battle:join-queue', (data) => {
    const { userId, mode, difficulty } = data;
    console.log(`[Battle] User ${userId} joined queue for ${mode} ${difficulty}`);

    // TODO: Implement matchmaking logic
  });

  /**
   * Player makes a move in battle
   */
  socket.on('battle:move', (data) => {
    const { battleId, position, value } = data;
    console.log(`[Battle] Move in battle ${battleId}`);

    // Broadcast move to opponent
    socket.broadcast.emit('battle:opponent-move', { position, value });
  });

  /**
   * Player completes puzzle
   */
  socket.on('battle:complete', (data) => {
    const { battleId, time } = data;
    console.log(`[Battle] Player completed battle ${battleId} in ${time}s`);

    // TODO: Determine winner and update scores
  });

  /**
   * Player concedes
   */
  socket.on('battle:concede', (data) => {
    const { battleId } = data;
    console.log(`[Battle] Player conceded from battle ${battleId}`);

    // Broadcast loss to opponent
    socket.broadcast.emit('battle:opponent-conceded');
  });
};
