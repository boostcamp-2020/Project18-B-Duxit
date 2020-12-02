import GameList from '@game/GameList';
import nickname from './nickname.json';

const generateRandomString = () =>
  Math.random().toString(36).substr(2, 5).toUpperCase();

const sortByRandom = () => Math.random() - 0.5;

const randomFunctions = {
  nickname: () => {
    const { adjective: adj, noun } = nickname;
    const randomAdj = adj[Math.floor(Math.random() * adj.length)];
    const randomNoun = noun[Math.floor(Math.random() * noun.length)];
    return `${randomAdj} ${randomNoun}`;
  },
  color: () => '#222222',
  roomID: () => {
    const randomString = generateRandomString();
    if (GameList.hasGame(randomString)) return randomFunctions.roomID();
    return randomString;
  },
  cards: (count) =>
    Array.from({ length: process.env.CARD_COUNT }, (value, index) => index)
      .sort(sortByRandom)
      .slice(count),
};

export default randomFunctions;
