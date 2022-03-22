/*
This one is not working as intented. Fix suggestions are welcome.
*/

import 'dotenv/config.js'
import {
  deployContract,
  executeContract,
  instantiateContract,
  queryContract,
  recover,
  setTimeoutDuration,
  uploadContract,
} from "./helpers.js"
import { LCDClient, LocalTerra, Wallet } from "@terra-money/terra.js"
import { join } from "path"
import { Base64 } from 'js-base64';
import 'dotenv/config';

// consts

const ARTIFACTS_PATH = "./../tokens"
const ASTRO_ARTIFACTS = "./../astroport"

const staking_address = process.env.staking_contract_addr!; //or other token
const admin_address = process.env.deployer_wallet_address!;
const user_address = process.env.user_wallet_address!;

// main

async function main() {
  let terra: LCDClient | LocalTerra
  let deployer: Wallet
  let user1: Wallet
  let user2: Wallet
  const isTestnet = process.env.NETWORK === "testnet"


 
  terra = new LocalTerra()
  deployer = (terra as LocalTerra).wallets.test1
  user1 = (terra as LocalTerra).wallets.test2
  user2 = (terra as LocalTerra).wallets.test3

//Execute
  function execute_receive(){
    return {'receive': {}}
  }

//Query
  function query_config(){
    return {'config': {}}
  }

  function query_total_shares(){
    return {'total_shares': {}}
  }

  function query_total_deposit(){
    return {'total_deposit': {}}
  }

  //Instantiate - just for info
  //function instantiate(deposit_token_addr: str, owner: str, token_code_id: int){
  //return {'deposit_token_addr': deposit_token_addr, 'owner': owner, 'token_code_id': token_code_id}

  /*------------------------------ YOUR CODE GOES HERE --------------------------------*/
  let st = "terra18kpr30vkr0l784huc0230dlu7s4f4tdltpmj0d";
  let resp = await queryContract(terra, st, query_config())
  console.log(resp)

/* ERROR TODO */
//TODO:
//fix this one 


}

main().catch(console.log)

