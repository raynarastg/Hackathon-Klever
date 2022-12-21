import { TransactionType, web } from '@klever/sdk';
import {
  connectWithSdk,
  connectWithWindow
} from './connections';

const balance = async ()=> {
  let balance = 0;
  try {
    balance = await window.kleverWeb.getBalance();
  } catch (e) {
    console.log(e);
  }

  return balance;
};

const send = async (to, amount) => {
  try {
    const tx = await web.buildTransaction([
      {
        type: TransactionType.Transfer,
        payload: {
          receiver: to,
          amount: amount,
          asset: 'KLV',
        },
      },
    ]);
  
    await web.signTransaction(tx);
    const res = await web.broadcastTransactions([tx]);
    return res;
  } catch (error) {
    return error
  }

};

export default {
  connectWithSdk,
  connectWithWindow,
  send,
  balance,
};
