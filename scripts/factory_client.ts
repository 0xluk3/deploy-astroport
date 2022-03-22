/*

This client implements all operations allowed by Astroport - Factory contract
Some of arguments are of type ANY but they should be respective structures e.g. asset info is a structure defined in the contract
Maybe I will implement them in the future
So far use the astroport contract or commented code as reference how to use them

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

  const factory_address = process.env.factory_contract_address!; //or other token
  console.log("Factory address: " + factory_address);

  //implement all execute operations

  function execute_update_config(fee_address:String, generator_address:String, token_code_id:Int, whitelist_code_id:Int){
    return {'update_config': {'fee_address': fee_address, 'generator_address': generator_address, 'token_code_id': token_code_id, 'whitelist_code_id': whitelist_code_id}}
  }
  
  function execute_update_pair_config(config: any){
    return {'update_pair_config': {'config': config}}
  }
  
  function execute_create_pair(asset_infos: any, pair_type: any, init_params: any){
    return {'create_pair': {'asset_infos': asset_infos, 'init_params': init_params, 'pair_type': pair_type}}
  }
  
  function execute_deregister(asset_infos: any){
    return {'deregister': {'asset_infos': asset_infos}}
  }
    
  function execute_propose_new_owner(expires_in: Int, owner: String){
    return {'propose_new_owner': {'expires_in': expires_in, 'owner': owner}}
  }
  
  function execute_drop_ownership_proposal(){
    return {'drop_ownership_proposal': {}}
  }

  function execute_claim_ownership(){
    return {'claim_ownership': {}}
  }

  //implement all query operations

  function query_config(){
    return {'config': {}}
  }

  function query_pair(asset_infos: any){
    return {'pair': {'asset_infos': asset_infos}}
  }

  function query_pairs(limit: Int, start_after: any){
    return {'pairs': {'limit': limit, 'start_after': start_after}}
  }
    
  function query_fee_info(pair_type: any){
    return {'fee_info': {'pair_type': pair_type}}
  }
    
  /*------------------------------ YOUR CODE GOES HERE --------------------------------*/
  //let resp = await queryContract(terra, factory_address, query_config())
  //console.log(resp)

  let token_a = process.env.token_a_contract_address!;
  let token_b = process.env.token_b_contract_address!;

  //sample create pair - OK
  //let msg_create_pair = {'create_pair': {'asset_infos': [{'token': {'contract_addr': token_a}}, {'native_token': {'denom': 'uusd'}}], 'pair_type': {'xyk': {}}}}
  //console.log(await  executeContract(terra, deployer, factory_address, msg_create_pair));

  //tokenB - UST - OK
  //let msg_create_pair2 = {'create_pair': {'asset_infos': [{'token': {'contract_addr': token_b}}, {'native_token': {'denom': 'ust'}}], 'pair_type': {'xyk': {}}}}
  //console.log(await  executeContract(terra, deployer, factory_address, msg_create_pair2));
/*
  TODO: Stable pair 
*/


}

main().catch(console.log)

