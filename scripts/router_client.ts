/*

"The Router contract contains logic to specify a custom (multi-hop) path to swap tokens on Astroport.

For example, someone can specify paths to swap the following tokens:
bLUNA -> LUNA -> UST
ANC -> UST -> ASTRO
The contract will check whether the resulting token (in these cases, UST and ASTRO respectively) 
is the correct one as well as check that the amount of tokens received is equal to or higher than the minimum amount asked."

Source: https://docs.astroport.fi/astroport/smart-contracts/router

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

const router_address = process.env.router_contract_address!; 
console.log("Factory address: " + router_address);

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
  

  //Execute operations
  function execute_receive(){
  return {'receive': {}}
  }


  function execute_execute_swap_operations(operations: any, max_spread: any, minimum_receive: any, to: any){
  return {'execute_swap_operations': {'max_spread': max_spread, 'minimum_receive': minimum_receive, 'operations': operations, 'to': to}}
  }

  function execute_execute_swap_operation(operation: any, max_spread: any, to:String){
  return {'execute_swap_operation': {'max_spread': max_spread, 'operation': operation, 'to': to}}
  }

  function execute_assert_minimum_receive(asset_info: any, minimum_receive:String, prev_balance:String, receiver:String){
  return {'assert_minimum_receive': {'asset_info': asset_info, 'minimum_receive': minimum_receive, 'prev_balance': prev_balance, 'receiver': receiver}}
  }

  /*???
  function cw20_execute_swap_operations(operations: any, max_spread: any, minimum_receive: any, to:String){
  return {'execute_swap_operations': {'max_spread': max_spread, 'minimum_receive': minimum_receive, 'operations': operations, 'to': to}}
  }*/

  //Query


  function query_config(){
    return {'config': {}}
  }
  
  function query_simulate_swap_operations(offer_amount: any, operations: any){
    return {'simulate_swap_operations': {'offer_amount': offer_amount, 'operations': operations}}
  }

  /*------------------------------ YOUR CODE GOES HERE --------------------------------*/
  //let resp = await queryContract(terra, router_address, query_config())
  //console.log(resp)

  //TODO: Sample query simulate_swap_operations query

}

main().catch(console.log)

