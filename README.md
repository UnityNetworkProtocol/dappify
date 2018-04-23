# DAppify

Embed a decentralized application on any website with a single line of code. 

Wish you could easily add blockchain and smart contract functionality directly into your website? The DAppify project is a prototype for easily generating embedabble React applications that connect with blockchain and smart contract solutions. Powered by platforms like uPort, MetaMask and IPFS (supported by Infura), the mini decentralized applications can be easily be embed on any website.

### Install

```
--- Developer Tools ---
$ npm install -g truffle

-------- Step 1 --------
git clone git@github.com:uport-project/dappify.git ; cd dappify

-------- Step 2 --------
npm install || yarn

-------- Step 3 --------
npm run build || yarn build => production
npm run start || yarn start => development
```

### Background
To make decentralized applications more accesible requires solutions for developers to easily add decentralized application features into existing websites. The DAppify project provides a boilerplate for developers to generate decentralized applications, which can be shared using a single line of Javascript. 

```
<script
  type="text/javascript" 
  data-smart-contract-address="0x311a70681f008d51f01e75032ee766718c9d74ba" // Pass in a smart contract address
  data-provider="uport" // Select Web3 provider. Currently support uPort, but MetaMask should be added.
  src="http://uportme.surge.sh/embed.js"
>
</script>
```

## Technical Information

#### Smart Contract Address Data Parameter
With DAppify it's possible to generate UI/UX specific to certain smart contract interactions. For example, the current boilerplate uses the `MeetupEvent` component located in the `/src/interface/features/` folder, which is passed a unique smart contract address during application initialization.

The `data-smart-contract-address` let's developers easily deploy the same UI/UX across different website, while still maintaining the ability to easily reference different smart contracts. Ultimately this seperation of concerns should help developers easily share ideas for decentralized applications, because anyone can easily deploy a smart contract and use "off-the-shelf" user-interface systems to interact with the referenced smart contract.

#### Provider Data Parameter
The `data-provider` will allow developers to decide what Web3 provider should be referenced. Currently, because this is a uPort repo, we only support uPort as the default provider. But, in the very near future MetaMask will also be supported. For example if a developer wants to sign transactions using the uPort mobile app simply reference include `data-provider="uport"` or if the user experience is best suited for MetaMask include `data-provider="metamask"`.

Deciding which Web3 provider should handle transaction signing only requires changing the `data-provider` parameter.

### Getting Started
To start developing a `dappify` project please refernce the `/src/index.js` and `/src/providers.js` Javascript files to understand how the React application embeds itself into existing websites

#### MeetupEvent Example
The current DAppify boilerplate includes a forked MeetupEvent.sol smart contract. The original smart contract be found at https://github.com/emazurek/simple-meetup-dapp - the difference being the smart contract no longder includes the `payable` parameter on the register function.

The `MeetupEvent.sol` smart contract is referenced in the `MeetupEvent` React component. The React component references the ABI parameter generated after running `truffile compile` command from the CLI.

### Future Features

##### Share Data with Global Window Object
Websites might need interact with the data generated/consumed decentralized application directly embedded into the website. Currently the DAppify uses a Redux Store to manage application state. In the instance websites want to access to information stored in the Redux store a helper library to store application in the global `window` object. Since the decentralized applications aren't embedded using an iFrame it's easier to interact with the primary DOM object.


