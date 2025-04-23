import Web3 from 'web3';

export const web3 = new Web3(window.ethereum as any);

export async function getWalletAddress(): Promise<string | null> {
  if (!window.ethereum) return null;
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  const accounts = await web3.eth.getAccounts();
  return accounts[0] || null;
}

export async function signMessage(message: string): Promise<string | null> {
  const address = await getWalletAddress();
  if (!address) return null;
  return await web3.eth.personal.sign(message, address, '');
}