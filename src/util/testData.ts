// e1de5d3e-3114-41b8-8c33-58a34460c071 Andrey
// 8baf4adb-3613-4a89-8ca1-c3d99b3eff26 IgorYovka
// 0ec51698-a45a-41cc-a099-4e68d09c98f0 Mellon Eask

import { IAsset } from '../interfaces/asset.interface';

export const dummyGameData = {
  items: {
    "b1a5ef06-aecd-4d13-a40d-fbf1cca2a238": {
      lvl: 3,
      owner: "e1de5d3e-3114-41b8-8c33-58a34460c071"
    },
    "6ff414ec-847a-40b5-a5dd-557f51d28f95": {
      lvl: 4,
      owner: "e1de5d3e-3114-41b8-8c33-58a34460c071"
    },
    "da4b5087-c179-4a35-9b9b-de7b3a6cc9bb": {
      owner: "8baf4adb-3613-4a89-8ca1-c3d99b3eff26"
    },
    "1b83613b-ac0a-4cfa-bac1-306b939177c1": {
      owner: "8baf4adb-3613-4a89-8ca1-c3d99b3eff26"
    },
    "2725febe-b275-4be5-8c13-a41f4e6bcb39": {
      owner: "8baf4adb-3613-4a89-8ca1-c3d99b3eff26"
    },
    "012f31a2-6815-49bd-9e2d-3eae15192e81": {
      lvl: 1,
      owner: "8baf4adb-3613-4a89-8ca1-c3d99b3eff26"
    },
    "23af14a7-0400-42c3-aa37-60eb95198b59": {
      owner: "e1de5d3e-3114-41b8-8c33-58a34460c071"
    },
    "c8ef888f-6b44-417a-abdb-376ac2fa9b4c": {
      lvl: 1,
      owner: "8baf4adb-3613-4a89-8ca1-c3d99b3eff26"
    },
    "59d910dc-6846-4699-827b-e2d7bd533b99": {
      lvl: 1,
      owner: "8baf4adb-3613-4a89-8ca1-c3d99b3eff26"
    },
    "9922de5e-9310-4e7a-bbfe-c01e581c806c": {
      lvl: 2,
      owner: "8baf4adb-3613-4a89-8ca1-c3d99b3eff26"
    },
    "089b2861-593e-4775-a868-1c70b79665a3": {
      owner: "e1de5d3e-3114-41b8-8c33-58a34460c071"
    },
    "dd9d3462-8195-45fe-9e8c-3eeab12e6371": {
      owner: "0ec51698-a45a-41cc-a099-4e68d09c98f0"
    },
    "96e07655-b56c-4c52-b9ef-0e6b26e726d9": {
      owner: "0ec51698-a45a-41cc-a099-4e68d09c98f0"
    },
    "4169cc50-a0bc-4178-98bf-11c5b613917b": {
      lvl: 4,
      owner: "0ec51698-a45a-41cc-a099-4e68d09c98f0"
    },
    "6ce6a9bc-e56a-4534-a398-65df72b3dbb2": {
      lvl: 4,
      owner: "0ec51698-a45a-41cc-a099-4e68d09c98f0"
    }
  },
  houseCount: 11,
  hotelCount: 21
};

export const dummyDataAdd = (asset: IAsset, players) => {
  const dummy = dummyGameData.items[asset.item];
  if(dummy){
    const pIdd = Object.keys(players).find(pId => {
      return players[pId].user.id === dummy.owner;
    });
    
    asset.lvl = dummy.lvl;
    asset.owner = pIdd;
  }
};