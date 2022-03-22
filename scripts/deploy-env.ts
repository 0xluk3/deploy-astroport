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
import * as fs from 'fs'; //save logfile - later

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

  setTimeoutDuration(0)
    


  console.log(`Wallet address of admin - deployer: ${deployer.key.accAddress}`)
  console.log(`Wallet address from user: ${user1.key.accAddress}`)
  

  /*************************************** Store / Upload Contracts *****************************************/
  console.log("[+] Uploading CW-20 token...")
  const token_code_id = await uploadContract(
    terra,
    deployer,
    join(ARTIFACTS_PATH, 'terraswap_token.wasm')
  )
  console.log("[+] Dummy CW-20 A token code_id:" + token_code_id )

  /*----------------------------------------------------------------------*/

  console.log("[+] Uploading CW-20 token...")
  const token_code_id2 = await uploadContract(
    terra,
    deployer,
    join(ARTIFACTS_PATH, 'terraswap_token.wasm')
  )
  console.log("[+] Dummy CW-20 B token code_id:" + token_code_id2)

  /*----------------------------------------------------------------------*/

    console.log('[+] Uploading xASTRO token contract...')
    const astro_token_id = await uploadContract(
      terra, 
      deployer, 
      join(ASTRO_ARTIFACTS, 'astroport_xastro_token.wasm')
    )

  /*----------------------------------------------------------------------*/

  console.log('[+] Uploading staking contract...')
  const staking_id = await uploadContract(
    terra, 
    deployer, 
    join(ASTRO_ARTIFACTS, 'astroport_staking.wasm')
  )

/*----------------------------------------------------------------------*/

  console.log("[+] Uploading pair contract...")
  const pair_code_id = await uploadContract(
    terra,
    deployer,
    join(ASTRO_ARTIFACTS, 'astroport_pair.wasm')
  )
  console.log("[+] Pair code_id:" + pair_code_id )

  /*----------------------------------------------------------------------*/

    console.log("[+] Uploading pair stable contract...")
    const pair_stable_code_id = await uploadContract(
      terra,
      deployer,
      join(ASTRO_ARTIFACTS, 'astroport_pair_stable.wasm')
    )
    console.log("[+] Pair stable code_id:" + pair_stable_code_id )

 /*----------------------------------------------------------------------*/

 console.log("[+] Uploading factory contract...")
 const factory_code_id = await uploadContract(
   terra,
   deployer,
   join(ASTRO_ARTIFACTS, 'astroport_factory.wasm')
 )
 console.log("[+] Factory code_id:" + factory_code_id )

 /*----------------------------------------------------------------------*/

 console.log("[+] Uploading astroport-whitelist contract...")
 const astroport_whitelist_code_id = await uploadContract(
   terra,
   deployer,
   join(ASTRO_ARTIFACTS, 'astroport_whitelist.wasm')
 )
 console.log("[+] Factory code_id:" + astroport_whitelist_code_id )


    
/*************************************** Deploy Contracts *****************************************/

//CW-20 TOKEN A
console.log("[+] Deploying TOKEN-A ...")

  const toka_contract = await deployContract(
    terra,
    deployer,
    join(ARTIFACTS_PATH, 'terraswap_token.wasm'),
    {"name":"TOKEN-A","symbol":"TOKA","decimals":6,"initial_balances":[{"address":deployer.key.accAddress, "amount":"1000000000"},{"address":user1.key.accAddress, "amount":"1000000000"}]},
  )
  console.log("[+] TOKEN-A Contract Address: " + toka_contract)
  
//CW-20 TOKEN B
console.log("[+] Deploying TOKEN-B ...")
await new Promise(resolve => setTimeout(resolve, 5000));
  const tokb_contract = await deployContract(
    terra,
    deployer,
    join(ARTIFACTS_PATH, 'terraswap_token.wasm'),
    {"name":"TOKEN-A","symbol":"TOKA","decimals":6,"initial_balances":[{"address":deployer.key.accAddress, "amount":"1000000000"},{"address":user1.key.accAddress, "amount":"1000000000"}]},
  )
  console.log("[+] TOKEN-B Contract Address: " + tokb_contract)


//CW-20 ASTRO
console.log("[+] Deploying xASTRO...")

  const tokxastro_contract = await deployContract(
    terra,
    deployer,
    join(ASTRO_ARTIFACTS, 'astroport_xastro_token.wasm'),
    {"name":"xASTROPORT TOKEN","symbol":"xASTRO","decimals":6,"initial_balances":[{"address":deployer.key.accAddress, "amount":"1000000000"},{"address":user1.key.accAddress, "amount":"1000000000"}]},
  )
  console.log("[+] ASTROPORT Token Contract Address: " + tokxastro_contract)
  
  //Staking
  console.log('[+] Deploy Staking...')
  await new Promise(resolve => setTimeout(resolve, 5000));
  let staking_contract_addr = await deployContract(
      terra,
      deployer,
      join(ASTRO_ARTIFACTS, 'astroport_staking.wasm'),
      {
          "owner": deployer.key.accAddress,
          "token_code_id": astro_token_id,
          "deposit_token_addr": tokxastro_contract,
      }
  )
  console.log("[+] Staking contract addr: " + staking_contract_addr)
//Astroport Factory
  console.log("[+] Deploying Factory...")
  await new Promise(resolve => setTimeout(resolve, 5000));

let pair_config = {
  "code_id": pair_code_id,
  "pair_type": { "xyk": {} },
  "total_fee_bps": 30, // 0.3% xyk
  "maker_fee_bps": 3333, // 1/3rd of xyk fees go to maker
  "is_disabled":false,
  "is_generator_disabled":false
}

let pair_stable_config = {
  "code_id": pair_stable_code_id,
  "pair_type": { "stable": {} },
  "total_fee_bps": 5, // 0.05% stableswap
  "maker_fee_bps": 5000, // 50% of stableswap fees go to the Maker
  "is_disabled":false,
  "is_generator_disabled":false
}

const factory = await deployContract(
  terra,
  deployer,
  join(ASTRO_ARTIFACTS, 'astroport_factory.wasm'),
  {"pair_configs":[pair_config, pair_stable_config], "token_code_id":token_code_id, "owner":deployer.key.accAddress, "whitelist_code_id":astroport_whitelist_code_id},
)

  console.log("[+] Factory Address: " + factory)

  console.log('[+] Deploy the Router...')
  await new Promise(resolve => setTimeout(resolve, 5000));

  let router_address = await deployContract(
      terra,
      deployer,
      join(ASTRO_ARTIFACTS, 'astroport_router.wasm'),
      {
          "astroport_factory": factory,
      },
  )
  console.log("[+] Router Contract Address: " + router_address)

  console.log('[+] Deploy the Maker...')
  await new Promise(resolve => setTimeout(resolve, 5000));

  let maker_addr = await deployContract(
      terra,
      deployer,
      join(ASTRO_ARTIFACTS, 'astroport_maker.wasm'),
      {
          "owner": deployer.key.accAddress,
          "factory_contract": factory,
          "staking_contract": staking_contract_addr,
          "astro_token_contract": tokxastro_contract,
      }
  )
  console.log("[+] Maker Contract Address: " + maker_addr)

  // Set maker address in factory
  console.log('[+] Set the Maker and the proper owner address in the factory')
  await new Promise(resolve => setTimeout(resolve, 5000));

  await executeContract(terra, deployer, factory, {
      "update_config": {
          "fee_address": maker_addr
      }
  })

  /*************************************** CREATE .ENV FILE WITH ALL NEW ADDRESSES *****************************************/
  console.log('[+] Generating .env file... ')
  await new Promise(resolve => setTimeout(resolve, 5000));

  const timestamp = Date.now()
  const humanReadableDateTime = new Date(timestamp).toLocaleString()
  
  let content = "#Generated at " + humanReadableDateTime + "\n"
+ `deployer_wallet_address=${deployer.key.accAddress}\n`
+ `user_wallet_address=${user1.key.accAddress}\n`
+ `token_a_contract_address=${toka_contract}\n`
+ `token_b_contract_address=${tokb_contract}\n`
+ `token_xastro_contract_address=${tokxastro_contract}\n`
+ `staking_contract_addr=${staking_contract_addr}\n`
+ `factory_contract_address=${factory}\n`
+ `router_contract_address=${router_address}\n`
+ `maker_contract_address=${maker_addr}\n`

  fs.writeFile('.env', content, function(err) {
      if (err) {
          return console.error(err);
      }
      console.log("\n[+] .env created!\n");
  });
  

/*************************************** end *****************************************/

//add more astroport components -> after study how they work
//write output to file with timestamp

}
main().catch(console.log)

