import { makeAutoObservable } from "mobx";

class UserStore {
  walletAddress;

  constructor() {
    makeAutoObservable(this);
  }

  setWalletAddress = (address) => {
    this.walletAddress = address;
  };
}

export const userStore = new UserStore();
