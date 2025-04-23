// types/global.d.ts
import { Ethereum } from '@metamask/providers';

declare global {
  interface Window {
    ethereum?: Ethereum;
  }
}
