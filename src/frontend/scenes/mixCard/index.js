import renderMixCard from './render';

const MixCard = class {
  constructor(endTime) {
    this.endTime = endTime;
  }

  render() {
    const { endTime } = this;
    const { arrayToBeRemoved = [] } = renderMixCard({ endTime });
    this.arrayToBeRemoved = arrayToBeRemoved;
  }

  wrapup() {
    this.arrayToBeRemoved.forEach((gameObject) => {
      gameObject.delete();
    });
  }
};

export default MixCard;
