import {
  BlockTxBroadcastResult,
  Coin,
  isTxError,
  LCDClient,
  MnemonicKey,
  Msg,
  MsgExecuteContract,
  MsgInstantiateContract,
  MsgMigrateContract,
  MsgStoreCode,
  Tx,
  TxError,
  Wallet
} from '@terra-money/terra.js';
import { readFileSync } from 'fs';
import { CustomError } from 'ts-custom-error'

let TIMEOUT = 1000

export function setTimeoutDuration(t: number) {
  TIMEOUT = t
}

export function getTimeoutDuration() {
  return TIMEOUT
}

let GAS_ADJUSTMENT = 1.2

export function setGasAdjustment(g: number) {
  GAS_ADJUSTMENT = g
}

export function getGasAdjustment() {
  return GAS_ADJUSTMENT
}

export async function sleep(timeout: number) {
  await new Promise(resolve => setTimeout(resolve, timeout))
}

export class TransactionError extends CustomError {
  public constructor(
    public code: number | string,
    public codespace: string | undefined,
    public rawLog: string,
  ) {
    super("transaction failed")
  }
}

export async function createTransaction(wallet: Wallet, msg: Msg) {
  return await wallet.createTx({
    msgs: [msg],
    gasAdjustment: GAS_ADJUSTMENT,
  })
}

export async function broadcastTransaction(terra: LCDClient, signedTx: Tx) {
  const result = await terra.tx.broadcast(signedTx)
  await sleep(TIMEOUT)
  return result
}

export async function performTransaction(terra: LCDClient, wallet: Wallet, msg: Msg) {
  const tx = await createTransaction(wallet, msg)
  const { account_number, sequence } = await wallet.accountNumberAndSequence()
  const signedTx = await wallet.key.signTx(tx,
    {
      accountNumber: account_number,
      sequence: sequence,
      chainID: terra.config.chainID,
      signMode: 1, // SignMode.SIGN_MODE_DIRECT
    }
  )
  const result = await broadcastTransaction(terra, signedTx)
  if (isTxError(result)) {
    throw transactionErrorFromResult(result)
  }
  return result
}

export function transactionErrorFromResult(result: BlockTxBroadcastResult & TxError) {
  return new TransactionError(result.code, result.codespace, result.raw_log)
}

export async function uploadContract(terra: LCDClient, wallet: Wallet, filepath: string) {
  const contract = readFileSync(filepath, 'base64');
  const uploadMsg = new MsgStoreCode(wallet.key.accAddress, contract);
  let result = await performTransaction(terra, wallet, uploadMsg);
  return Number(result.logs[0].eventsByType.store_code.code_id[0]) // code_id
}

export async function instantiateContract(terra: LCDClient, wallet: Wallet, codeId: number, msg: object, admin?: string) {
  if (admin == undefined) {
    admin = wallet.key.accAddress
  }
  const instantiateMsg = new MsgInstantiateContract(wallet.key.accAddress, admin, codeId, msg, undefined);
  let result = await performTransaction(terra, wallet, instantiateMsg)
  const attributes = result.logs[0].events[0].attributes
  return attributes[attributes.length - 1].value // contract address
}

export async function executeContract(terra: LCDClient, wallet: Wallet, contractAddress: string, msg: object, coins?: string) {
  const executeMsg = new MsgExecuteContract(wallet.key.accAddress, contractAddress, msg, coins);
  return await performTransaction(terra, wallet, executeMsg);
}

export async function queryContract(terra: LCDClient, contractAddress: string, query: object): Promise<any> {
  return await terra.wasm.contractQuery(contractAddress, query)
}

export async function deployContract(terra: LCDClient, wallet: Wallet, filepath: string, initMsg: object) {
  const codeId = await uploadContract(terra, wallet, filepath);
  return await instantiateContract(terra, wallet, codeId, initMsg);
}

export async function migrate(terra: LCDClient, wallet: Wallet, contractAddress: string, newCodeId: number) {
  const migrateMsg = new MsgMigrateContract(wallet.key.accAddress, contractAddress, newCodeId, {});
  return await performTransaction(terra, wallet, migrateMsg);
}

export function recover(terra: LCDClient, mnemonic: string) {
  const mk = new MnemonicKey({ mnemonic: mnemonic });
  return terra.wallet(mk);
}

export function initialize(terra: LCDClient) {
  const mk = new MnemonicKey();

  console.log(`Account Address: ${mk.accAddress}`);
  console.log(`MnemonicKey: ${mk.mnemonic}`);

  return terra.wallet(mk);
}
