// import KleverWeb from '@klever/kleverweb';
import { web } from '@klever/sdk';

const testNetProvider = {
  node: 'https://node.testnet.klever.finance',
  api: 'https://api.testnet.klever.finance',
};

export const connectWithSdk = async () => {
  if (!window.kleverWeb) {
    return 'KleverWeb is not installed';
  }
  web.setProvider(testNetProvider);
  await web.initialize();

  return web.getWalletAddress();
};

export const connectWithWindow = async ()=> {
  if (!window.kleverWeb) {
    return 'KleverWeb is not installed';
  }

  await window.kleverWeb.setProvider(testNetProvider);

  const address = await window.kleverWeb.initialize();
  return address;
};