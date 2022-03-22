/* 
Maker contract client
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
import { Int, LCDClient, LocalTerra, Wallet } from "@terra-money/terra.js"
import { join } from "path"
import { Base64 } from 'js-base64';
import 'dotenv/config';

// consts

const ARTIFACTS_PATH = "./../tokens"
const ASTRO_ARTIFACTS = "./../astroport"

const maker_address = process.env.maker_contract_address!; 
const admin_address = process.env.deployer_wallet_address!;
const user_address = process.env.user_wallet_address!;

//https://docs.astroport.fi/astroport/smart-contracts/tokenomics/maker


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

function execute_collect(assets:any){
  return {'collect': {'assets': assets}}
  }
  
  function execute_update_config(factory_contract:String, governance_contract:any, governance_percent:any, max_spread:any, staking_contract:String){
  return {'update_config': {'factory_contract': factory_contract, 'governance_contract': governance_contract, 'governance_percent': governance_percent, 'max_spread': max_spread, 'staking_contract': staking_contract}}
  }
  
  function execute_update_bridges(add:any, remove:any){
  return {'update_bridges': {'add': add, 'remove': remove}}
  }
  
  function execute_swap_bridge_assets(assets:any, depth:Int){
  return {'swap_bridge_assets': {'assets': assets, 'depth': depth}}
  }
  
  function execute_distribute_astro(){
  return {'distribute_astro': {}}
  }
  
  function execute_propose_new_owner(expires_in:Int, owner:String){
  return {'propose_new_owner': {'expires_in': expires_in, 'owner': owner}}
  }
  
  function execute_drop_ownership_proposal(){
  return {'drop_ownership_proposal': {}}
  }
  
  function execute_claim_ownership(){
  return {'claim_ownership': {}}
  }
  
  function execute_enable_rewards(blocks:Int){
  return {'enable_rewards': {'blocks': blocks}}
  }
  
  //Query
  
  function query_config(){
  return {'config': {}}
  }
  
  function query_balances(assets:any){
  return {'balances': {'assets': assets}}
  }
  
  function query_bridges(){
  return {'bridges': {}}
  }
  
  /*
  function instantiate(astro_token_contract:String, factory_contract:String, owner:String, staking_contract:String, governance_contract:String, governance_percent, max_spread){
  return {'astro_token_contract': astro_token_contract, 'factory_contract': factory_contract, 'governance_contract': governance_contract, 'governance_percent': governance_percent, 'max_spread': max_spread, 'owner': owner, 'staking_contract': staking_contract}
  */

  /*------------------------------ YOUR CODE GOES HERE --------------------------------*/
  //let resp = await queryContract(terra, maker_address, query_config())
  //console.log(resp)
  //OK

}

main().catch(console.log)

