# Datavault Smart Contract

This directory contains the Compact smart contract for the Datavault marketplace.

## Contract: DatavaultMarketplace

A privacy-preserving marketplace for AI training data built on Midnight Network.

### Key Features

- **Private State**: Content licenses and usage details are kept private
- **Shielded Transactions**: Payments are processed privately
- **ZK Proofs**: Usage is verified without revealing accessor identity
- **Public Transparency**: Aggregate statistics visible to all

### Compilation

```bash
midnight-js-cli compile contracts/
```

### Deployment

```bash
# Deploy to local node
midnight-js-cli deploy --network local

# Deploy to testnet
midnight-js-cli deploy --network testnet

# Deploy to mainnet
midnight-js-cli deploy --network mainnet
```

### Testing

```bash
midnight-js-cli test
```

## Privacy Model

### Public Information
- Content metadata (title, type, price)
- Total usage counts
- Platform statistics
- Creator addresses (for content they create)

### Private Information
- License purchaser identity
- Individual usage timestamps
- Exact access patterns
- Detailed usage events

### ZK Proof Verification
The contract uses Midnight's `@zkProof` annotation to verify usage without revealing:
- Who accessed the content
- Exact time of access
- API call details
