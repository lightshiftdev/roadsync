
# RoadSync

Simulation of real-time vehicle synchronization network to help manage road traffic efficiency with on-chain transactions and validation.

All vehicles within a certain radius are connected to a real-time session using decentralized edge reflectors. All computation is happening locally, and all participants are running the same shared VM.

Transactions between vehicles, such as “bribe to overtake” are happening in real-time on chain.

## Usage

There are two components of the project, the shared simulation that uses [Croquet](https://croquet.io/) and the smart contracts, written in Solidity and deployed in [Core](https://coredao.org/).

### Dependencies

* NodeJS

### Croquet

The Croquet component can be found on the `croquet/` directory.

**RUNNING LOCALLY**

```
npm install
npm run dev
```

**BUILDING FOR DEPLOYMENT**

```
npm install
npm run build
```

The built application will be on the `dist\` directory.

### Smart Contracts

The smart contracts component can be found on the `contracts/` directory, it has its own [README](https://github.com/lightshiftdev/roadsync/tree/master/contracts).
