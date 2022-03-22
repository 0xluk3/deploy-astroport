## What is this for
This repo is used to deploy astroport on LocalTerra and interact with it in one script.
Useful for testing any Terra projects that interacts with Astroport - saves time for setting up environment.

## Prequisities:

- LocalTerra downloaded and being able to run it
- nodejs installed 

The repo contains precompiled contracts in .wasm form from both Astroport and Terraswap (basic CW tokens) which were compiled few days before uploading it to github. If in the future they change and I don't update them here you will need to compile contract yourself and place them in 
astroport/ and tokens/ folders.

## How to run?

Download and start LocalTerra in a separate terminal 
- Localterra - https://github.com/terra-money/LocalTerra
- Terraswap - https://github.com/terraswap/terraswap
- Astroport - https://github.com/astroport-fi/astroport-core



```cd LocalTerra && docker-compose up  ```

```git clone REPO && cd REPO/scripts  ```

```npm install  ```

```./run deploy-env.ts``` 

Then you can use any client to communicate with respective astroport component. They are reusing .env file created at deployment to get contract addresses to communicate with.


The "clients" are implementing basic operations and have some function templates, but exact arguments (and some JSON structures) are not provided at the moment, so it might be useful to check them in Astroport Contracts (https://github.com/astroport-fi/astroport-core/tree/main/contracts) or Astroport Docs (https://docs.astroport.fi/astroport/)

## Credits: 
Interacting with LocalTerra is achieved with (https://github.com/punishell/Terra-Scripts.js)

Function prototypes were scrapped from astroport contracts using Schema to Class (https://github.com/Alecsis/cw-tools/tree/main/schema_to_class)

## Known Issues:
- Scripts are blocked on MacOS (https://stackoverflow.com/questions/60087434/macos-catalina-fse-node-cannot-be-opened-because-the-developer-cannot-be-ver)
- On slower system localterra dies in the middle of deployment, but this is system problem

## Find me 
For any suggestions or issues you can find me on twitter @0xluk3

todo: use other clients to e.g. create base pairs - how to import function from another file
describe other clients
