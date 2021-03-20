export default function fillGetTileLocation(item: any) {
  item.getTileLocation = () => new Promise(resolve => {
    resolve({
      x: item.x,
      y: item.y,
      location: item.location
    });
  });
}
