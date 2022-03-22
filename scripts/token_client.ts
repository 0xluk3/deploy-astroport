/*

This file is a client that implements all query and execute operations from a standard CW-20 TOKEN
It is part of astroport for instatnt setup
By default, it takes token address from .env file, but it can be hardcoded / customized
The first part contains some constants copied from deployer script and import some addresses from .env
The second part implements all the functions definitions that can be used
The third part allows for invoking these functions with custom argument.
So basically to use it you have just to invoke certain function with arguments you like, put them at the end fo file as per the comments and 
Run the script, you can do it with ./run.sh token_client.ts

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
import * as dotenv from "dotenv";

// consts

const ARTIFACTS_PATH = "./../tokens"
const ASTRO_ARTIFACTS = "./../astroport"
const token_address = process.env.token_a_contract_address!; //or other token
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


  
  //console.log(token_address);

  
  function execute_transfer(amount: String, recipient: String) {
    return {'transfer': {'amount': amount, 'recipient': recipient}}
  }

	function execute_burn(amount: String) {
    return {'burn': {'amount': amount}}
  } //(amount: str){

	function execute_send(amount: String, contract: String, msg: String) {
    return {'send': {'amount': amount, 'contract': contract, 'msg': msg}}
  } //(amount: str, contract: str, msg: str){

	function execute_mint(amount: String, recipient: String) {
    return {'mint': {'amount': amount, 'recipient': recipient}}
  } //(amount: str, recipient: str){

	function execute_increase_allowance(amount: String, spender: String, expires: any) {
    return {'increase_allowance': {'amount': amount, 'expires': expires, 'spender': spender}}
  } //(amount: str, spender: str, expires = None){

	function execute_decrease_allowance(amount: String, expires: any, spender: String) {
    return {'decrease_allowance': {'amount': amount, 'expires': expires, 'spender': spender}}
  } //(amount: str, spender: str, expires = None){

	function execute_transfer_from(amount: String, owner: String, recipient: String) {
    return {'transfer_from': {'amount': amount, 'owner': owner, 'recipient': recipient}}
  } //(amount: str, owner: str, recipient: str){

	function execute_send_from(amount: String, contract: String, msg: String, owner: String) {
    return {'send_from': {'amount': amount, 'contract': contract, 'msg': msg, 'owner': owner}}
  } //(amount: str, contract: str, msg: str, owner: str){

	function execute_burn_from(amount: String, owner: String) {
    return {'burn_from': {'amount': amount, 'owner': owner}}
  } //(amount: str, owner: str){

  //Example implementation
  /*
      let resp = await executeContract(terra, deployer, token_address, execute_burn);
      console.log(resp + "\n")
  */	


  //implement all query operations

 
	function query_balance(address: String) {
    return {'balance': {'address':address}} 
  }

	function query_token_info() {
    return {'token_info': {}}
  } 

  function query_minter() {
    return {'minter': {}}
  } //(){

  function query_allowance(owner: String, spender: String) {
        return {'allowance': {'owner': owner, 'spender': spender}}
  } 

  function query_all_allowances(owner: String, limit: Int, start_after: String) {
    return {'all_allowances': {'limit': limit, 'owner': owner, 'start_after': start_after}}//(owner: str, limit: int = None, start_after: str = None){
  } 

  function query_all_accounts(limit: Int, start_after: String) {
    return {'all_accounts': {'limit': limit, 'start_after': start_after}}//(limit: int = None, start_after: str = None){
  } 

  //Example implementation
  /*
      let resp = await queryContract(terra, token_address, query_token_info)
      //console.log(resp)
  */	

  /*    let resp = await queryContract(terra, token_address, query_token_info())
      ////
      let resp2 = await queryContract(terra, token_address, query_balance(user_address))
      console.log(resp2)
  *//*
  let balance_before = await queryContract(terra, token_address, query_balance(admin_address))
  console.log(balance_before)
  let resp = await executeContract(terra, deployer, token_address, execute_transfer("1000", user_address))
  console.log(resp)
  
  let balance_after = await queryContract(terra, token_address, query_balance(admin_address))
  console.log(balance_after)

  //send operation (if target contract requires cw20_receive from a token contract)

  //let regmsg = {"start_time":1649669232,"other_recv_msg_argument":"blah"}
  //let data = {"receive_message":regmsg}
  //const msg_encoded = Base64.encode(JSON.stringify(data));
  //
  //const msg = {"send":{"contract":target_contract,"amount":"1000000","sender":"terra1x46rqay4d3cssq8gxxvqz8xt6nwlz4td20k38v","msg":msg_encoded}}
  //console.log(await executeContract(terra, deployer, target_token, msg));

  */

}

main().catch(console.log)

