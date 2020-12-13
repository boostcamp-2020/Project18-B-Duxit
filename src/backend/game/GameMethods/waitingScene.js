import GAME_STATE from '@utils/gameState';
import { PLAYER, CARD, TIME } from '@utils/number';
import generateRandom from '@utils/generateRandom';

function isEnterable() {
  if (this.status.state !== GAME_STATE.WAITING || this.users.size >= PLAYER.MAX)
    return false;
  return true;
}

function updateUserProfile({ socketID, nickname, color }) {
  const user = this.getUser(socketID);
  if (color) user.setColor(color);
  if (nickname) user.setNickname(nickname);
}

function startGame() {
  // 플레이어들의 turnID 설정
  // TODO: turnID 섞기
  [...this.users.values()].forEach((user, index) => {
    user.initOnStart({ turnID: index });
  });

  // 게임에 사용할 카드 섞어서 세팅하기
  this.status.unusedCards = generateRandom.cards(CARD.DECK);

  this.setEndTime(TIME.WAIT_TELLER_SELECT);
}

function endWaitingScene() {
  this.startGame();
  this.startTellerScene();
}

const methodGroup = {
  isEnterable,
  updateUserProfile,
  startGame,
  endWaitingScene,
};

export default methodGroup;
