import { compress, decompress } from "../util/compression";

class StoreData {
  saveOnLocal(key: string, store: any, hydrating?: boolean) {
    if (hydrating) return;

    const storeString = JSON.stringify(store);
    const criptedData = compress(storeString);

    localStorage.setItem(key, criptedData);
  }

  getLocalStore(key: string) {
    const localStore = localStorage.getItem(key);

    if (localStore) {
      const decriptedData = decompress(localStore);
      return JSON.parse(decriptedData);
    }
  }
}

export default new StoreData();
