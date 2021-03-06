import connectAPIClient from '@/src/api/util/connectAPIClient';

describe('character.findWalkingPathTo', () => {
  it('should find a walking path for the farmer', async () => {
    const client = await connectAPIClient();
    const player = client.bridge.game1.player;
    const walkingPath = await player.findWalkingPathTo({
      x: 66,
      y: 18,
      location: 'Farm'
    });
    console.log(walkingPath.path);/*
    const walkingPath2 = await player.findWalkingPathTo({
      x: 3,
      y: 11,
      location: 'FarmHouse'
    }, 0, 10);
    console.log(walkingPath2.path); */
    /* const walkingPath3 = await player.findWalkingPathTo({
      x: 11,
      y: 17,
      location: 'BusStop'
    }, 0, 10);
    console.log(walkingPath3.path); */
  });
});
