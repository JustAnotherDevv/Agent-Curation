const { ethers } = require("ethers");

const RPC_URL = "http://localhost:8547";
const PRIVATE_KEY =
  "0xb6b15c8cb491557369f3c7d2c287b053eb229daa9c22138887752191c9520659";
const CONTRACT_ADDRESS = "0xd286df00cd652c1c48b55fdb276b3c1ef00d7ead";

const CONTRACT_ABI = [
  {
    inputs: [],
    name: "initialize",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256[]", name: "components", type: "uint256[]" },
      { internalType: "uint8[]", name: "metadata", type: "uint8[]" },
    ],
    name: "addVector",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "uint256[]", name: "components", type: "uint256[]" },
    ],
    name: "updateVector",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
    name: "deleteVector",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "uint256", name: "index", type: "uint256" },
    ],
    name: "getComponent",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
    name: "getDimension",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
    name: "getOwner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "id1", type: "uint256" },
      { internalType: "uint256", name: "id2", type: "uint256" },
    ],
    name: "dotProduct",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
    name: "magnitudeSquared",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "value", type: "uint256" },
      { internalType: "uint32", name: "decimals", type: "uint32" },
    ],
    name: "toFixedPoint",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getScaleFactor",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
    name: "vectorExists",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "id1", type: "uint256" },
      { internalType: "uint256", name: "id2", type: "uint256" },
    ],
    name: "cosineSimilarity",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const sampleDocuments = [
  "Blockchain is a distributed ledger technology that maintains a continuously growing list of records, called blocks, which are linked and secured using cryptography. Each block contains a timestamp and transaction data that is verified by network nodes.",
  "Decentralization is a core principle of blockchain technology, removing the need for central authorities and allowing peer-to-peer transactions. This creates systems resistant to censorship and single points of failure.",
  "Consensus mechanisms are protocols that ensure all nodes in a blockchain network agree on the validity of transactions. Popular mechanisms include Proof of Work (PoW), Proof of Stake (PoS), and Delegated Proof of Stake (DPoS).",
  "Proof of Work (PoW) is a consensus algorithm requiring participants (miners) to solve complex mathematical puzzles to validate transactions and create new blocks. Bitcoin uses this energy-intensive mechanism.",
  "Proof of Stake (PoS) is an alternative consensus mechanism where validators are selected to create new blocks based on the number of coins they hold and are willing to 'stake' as collateral, requiring significantly less energy than PoW.",
  "Block explorers are web applications that allow users to search and navigate blockchain data, including transactions, addresses, blocks, and smart contracts. Examples include Etherscan for Ethereum and Blockchair for multiple chains.",
  "Public blockchains are permissionless networks open to anyone, while private blockchains restrict participation to authorized entities. Hybrid models called consortium blockchains are governed by a group of organizations.",
  "Immutability is a key property of blockchain systems, making recorded data practically unchangeable. Once information is added to the blockchain, it cannot be altered without consensus from the network majority.",
  "Cryptographic hash functions are mathematical algorithms that convert input data into fixed-size output strings. Blockchains use these to create unique identifiers for blocks and verify data integrity.",
  "Merkle trees are data structures used in blockchains to efficiently verify large datasets. They summarize all transactions in a block by producing a digital fingerprint of the entire set of transactions.",
  "Bitcoin, created in 2009 by an anonymous entity known as Satoshi Nakamoto, was the first cryptocurrency and remains the largest by market capitalization. It introduced blockchain technology to enable peer-to-peer electronic cash.",
  "Ethereum, launched in 2015 by Vitalik Buterin, is a blockchain platform featuring smart contract functionality. Its native cryptocurrency, Ether (ETH), is used to pay for transaction fees and computational services.",
  "Stablecoins are cryptocurrencies designed to minimize price volatility, typically by pegging their value to fiat currencies like the US dollar. Examples include USDC, USDT (Tether), and DAI.",
  "Altcoins refer to all cryptocurrencies other than Bitcoin. They often introduce new features or improvements, such as faster transaction times, different consensus mechanisms, or specialized functions.",
  "Cryptocurrency wallets are software applications or hardware devices that store the private keys needed to access and manage digital assets. They come in hot (online) and cold (offline) storage variants.",
  "Token standards define rules for creating and managing digital assets on blockchains. For example, Ethereum has ERC-20 for fungible tokens and ERC-721 for non-fungible tokens (NFTs).",
  "Mining is the process of validating transactions and adding them to the blockchain ledger in proof-of-work systems. Miners compete to solve complex mathematical problems, with successful miners rewarded with newly minted coins.",
  "Cryptocurrency exchanges are platforms where users can buy, sell, and trade digital assets. They can be centralized (controlled by a company) or decentralized (operating via smart contracts).",
  "Market capitalization in cryptocurrencies is calculated by multiplying the current price of a coin by its circulating supply, providing a measure of a cryptocurrency's relative size and dominance.",
  "Tokenomics is the study of the economic systems governing the creation, distribution, and use of tokens or cryptocurrencies. It includes aspects like supply caps, issuance schedules, and utility functions.",
  "NFTs (Non-Fungible Tokens) are unique digital assets verified using blockchain technology. Unlike cryptocurrencies such as Bitcoin, each NFT has a distinct value and cannot be exchanged on a like-for-like basis.",
  "NFT marketplaces allow users to buy, sell, and trade digital collectibles. Popular platforms include OpenSea, Rarible, and Foundation, which support various blockchain networks.",
  "The ERC-721 standard is the most common standard for NFTs on the Ethereum blockchain. It defines how to create non-fungible tokens with unique identifiers and metadata.",
  "Digital art has become one of the most popular applications of NFT technology, allowing artists to create verifiably unique digital works that can be bought, sold, and collected.",
  "NFT royalties enable creators to earn a percentage of sales whenever their digital assets are resold on the secondary market, providing ongoing income streams.",
  "NFT metadata typically includes a name, description, and URI pointing to a digital asset. This data is stored either on-chain or on decentralized storage systems like IPFS.",
  "The environmental impact of NFTs has been debated due to the energy consumption of proof-of-work blockchains, leading to the development of more eco-friendly alternatives.",
  "NFT fractionalization allows multiple people to own shares of a single NFT, making high-value digital assets more accessible to average investors through tokenization.",
  "Dynamic NFTs (dNFTs) can change their properties based on external conditions or triggers, unlike standard NFTs which remain static after minting.",
  "Soulbound tokens (SBTs) are non-transferable NFTs that represent achievements, credentials, or affiliations, potentially forming the basis for decentralized identity systems.",
  "Decentralized Finance (DeFi) refers to blockchain-based financial services that operate without centralized intermediaries like banks, using smart contracts to enable lending, borrowing, trading, and more.",
  "Automated Market Makers (AMMs) are smart contracts that create liquidity pools of tokens, allowing users to trade cryptocurrencies without traditional order books. Examples include Uniswap and Curve Finance.",
  "Liquidity mining incentivizes users to provide funds to DeFi protocols by rewarding them with the platform's native tokens, also known as yield farming.",
  "Flash loans are uncollateralized loans where borrowing and repayment must occur within a single blockchain transaction. They're primarily used for arbitrage opportunities and have introduced new security challenges.",
  "Decentralized exchanges (DEXs) enable peer-to-peer trading of cryptocurrencies without intermediaries. They typically use automated market makers or order books managed by smart contracts.",
  "Yield farming involves strategically moving crypto assets between different DeFi platforms to maximize returns from interest, fees, and token rewards.",
  "DeFi lending platforms allow users to lend their crypto assets to earn interest or borrow assets by posting collateral. Popular platforms include Aave, Compound, and MakerDAO.",
  "Impermanent loss occurs when the price ratio of tokens in a liquidity pool changes compared to when they were deposited, potentially resulting in less value than simply holding the assets.",
  "Total Value Locked (TVL) is a metric that represents the sum of all assets deposited in DeFi protocols, often used as an indicator of the sector's growth and adoption.",
  "Synthetic assets in DeFi are tokens that track the value of real-world assets like stocks, commodities, or fiat currencies, allowing users to gain exposure to these markets without leaving the crypto ecosystem.",
  "Decentralized Autonomous Organizations (DAOs) are blockchain-based entities governed by smart contracts and community voting rather than traditional hierarchical management structures.",
  "Governance tokens grant voting rights in DAOs, allowing holders to propose and vote on changes to protocols, fund allocations, and other governance decisions.",
  "DAO treasuries hold the collective assets of the organization, which may include cryptocurrencies, NFTs, or other digital assets. These funds are typically managed through community governance.",
  "Quadratic voting is a mechanism used by some DAOs where voting power increases as the square root of tokens held, reducing the influence of large token holders and promoting more democratic decision-making.",
  "Multi-signature (multisig) wallets require multiple private key signatures to authorize transactions, providing an important security measure for DAO treasury management.",
  "On-chain governance refers to processes where all governance actions, including proposals and voting, happen directly on the blockchain, creating transparent and immutable records of decision-making.",
  "DAO contributors are typically rewarded with tokens or other incentives for their work, creating new models for decentralized collaboration and value distribution.",
  "Legal frameworks for DAOs are still evolving, with some jurisdictions beginning to recognize them as legal entities, while others consider them partnerships with unlimited liability for members.",
  "Investment DAOs pool resources to collectively invest in cryptocurrencies, NFTs, or other blockchain projects, distributing returns proportionally to members.",
  "Protocol DAOs govern the development and parameters of DeFi protocols, with token holders voting on fee structures, risk parameters, and protocol upgrades.",
  "Web3 refers to the vision of a decentralized internet built on blockchain technology, where users control their own data, digital assets, and online identities.",
  "Interoperability protocols enable different blockchains to communicate and share information, addressing the fragmentation of the blockchain ecosystem. Examples include Polkadot, Cosmos, and Chainlink.",
  "Layer 1 blockchains are base networks like Bitcoin and Ethereum that validate and finalize transactions on their own blockchain.",
  "Layer 2 scaling solutions build on top of existing blockchains to improve transaction throughput and reduce fees. Examples include Optimistic Rollups, ZK-Rollups, and State Channels.",
  "Decentralized storage networks like InterPlanetary File System (IPFS), Arweave, and Filecoin distribute data across multiple nodes, creating more resilient alternatives to centralized cloud storage.",
  "Oracles bridge the gap between blockchains and external data sources, enabling smart contracts to react to real-world events and information. Chainlink is a prominent oracle network.",
  "Web3 identity solutions aim to give users control over their digital identities through self-sovereign identity models, often utilizing verifiable credentials and decentralized identifiers (DIDs).",
  "Node infrastructure provides access points to blockchain networks. Infura and Alchemy are popular providers that offer APIs for developers to connect to networks like Ethereum.",
  "Sharding is a scalability technique that partitions blockchain data across multiple smaller chains (shards), allowing for parallel processing and increased throughput.",
  "Bridges facilitate the transfer of assets and information between different blockchain networks, enabling cross-chain functionality and liquidity.",
  "Smart contracts are self-executing programs stored on a blockchain that run when predetermined conditions are met. They power the functionality of NFTs and other decentralized applications.",
  "Solidity is the most widely used programming language for writing smart contracts on Ethereum and compatible blockchains. It's a statically typed language designed specifically for blockchain development.",
  "Smart contract auditing involves reviewing code to identify vulnerabilities, bugs, and security issues before deployment. Professional audit firms help reduce the risk of exploits and financial losses.",
  "Gas fees on Ethereum are payments made by users to compensate for the computing energy required to process and validate transactions, including smart contract operations.",
  "Decentralized Applications (dApps) are applications that run on distributed computing systems, typically blockchains. They use smart contracts for their backend logic instead of centralized servers.",
  "Oracles enable smart contracts to access off-chain data, allowing them to respond to real-world events. Without oracles, smart contracts are limited to information already on the blockchain.",
  "Proxy patterns in smart contracts allow developers to upgrade contract functionality while maintaining the same address and state, addressing the immutable nature of deployed contracts.",
  "Reentrancy attacks exploit vulnerabilities in smart contracts by recursively calling functions before previous executions complete, potentially draining funds. The 2016 DAO hack used this technique.",
  "Time locks are security mechanisms that enforce delays between initiating and executing certain smart contract functions, providing time for users to react to potentially malicious actions.",
  "Factory contracts are templates used to deploy multiple instances of similar contracts, reducing gas costs and standardizing implementations across applications.",
  "Private key management is critical in blockchain security. If a private key is lost, access to associated assets is permanently lost; if stolen, assets can be taken by unauthorized parties.",
  "51% attacks occur when a single entity controls more than half of a blockchain network's mining or validation power, potentially allowing them to manipulate transaction records or double-spend coins.",
  "Zero-knowledge proofs allow one party to prove to another that a statement is true without revealing additional information, enhancing privacy in blockchain transactions.",
  "Hardware wallets store private keys offline on dedicated devices, providing enhanced security against online threats for cryptocurrency and NFT storage.",
  "Multi-signature wallets require multiple private keys to authorize transactions, adding an extra layer of security for high-value accounts and organizational funds.",
  "Smart contract vulnerabilities have led to numerous hacks and exploits in the blockchain space. Common issues include reentrancy attacks, integer overflow/underflow, and unchecked external calls.",
  "Blockchain analytics firms track and analyze on-chain transactions, potentially compromising privacy despite the pseudonymous nature of most blockchain systems.",
  "Privacy coins like Monero and Zcash implement advanced cryptographic techniques to obscure transaction details, providing greater anonymity than transparent blockchains like Bitcoin.",
  "Secure multi-party computation allows multiple parties to jointly compute functions over inputs while keeping those inputs private, enabling collaborative analytics without exposing sensitive data.",
  "Phishing attacks remain one of the most common security threats in the blockchain space, with attackers creating convincing fake websites and communications to steal private keys and passwords.",
  "Cryptocurrency regulations vary significantly by country, ranging from complete bans to progressive frameworks designed to encourage innovation while protecting consumers.",
  "Anti-Money Laundering (AML) and Know Your Customer (KYC) requirements are increasingly being applied to cryptocurrency exchanges and services, requiring user identity verification.",
  "Securities regulations may apply to certain cryptocurrencies and tokens if they meet the criteria of investment contracts under frameworks like the Howey Test in the United States.",
  "Central Bank Digital Currencies (CBDCs) are government-issued digital currencies that use blockchain or distributed ledger technology but remain under centralized control.",
  "Regulatory sandboxes provide controlled environments where blockchain startups can test innovative products with regulatory oversight but temporary exemptions from certain rules.",
  "Tax treatment of cryptocurrencies and NFTs varies by jurisdiction, with many countries now requiring reporting of crypto transactions, mining rewards, and capital gains.",
  "Decentralized finance (DeFi) presents unique regulatory challenges due to its borderless nature and lack of identifiable intermediaries to enforce regulations.",
  "Travel rule compliance requires virtual asset service providers to share sender and recipient information for cryptocurrency transfers, aligning with FATF recommendations.",
  "Stablecoin regulation has become a focus area for many jurisdictions, with concerns about financial stability, monetary policy, and potential for systemic risk.",
  "Self-regulation through industry associations and standards bodies has emerged as the blockchain sector attempts to establish best practices ahead of formal government regulation.",
  "Supply chain tracking uses blockchain to create transparent and immutable records of product journeys from manufacturers to consumers, enhancing traceability and reducing fraud.",
  "Digital identity solutions built on blockchain enable self-sovereign identity management, giving individuals control over their personal data and how it's shared.",
  "Tokenization of real-world assets involves representing physical assets like real estate, art, or commodities as tokens on a blockchain, potentially increasing liquidity and access.",
  "Decentralized social media platforms aim to give users ownership of their data and content, with transparent algorithms and resistance to censorship or platform control.",
  "Blockchain voting systems could potentially increase election transparency and security, though implementation challenges and security concerns remain significant barriers.",
  "Healthcare applications of blockchain include secure sharing of medical records, tracking pharmaceutical supply chains, and verifying credentials of healthcare providers.",
  "Play-to-earn gaming models utilize blockchain and NFTs to allow players to earn cryptocurrency rewards with real-world value through gameplay.",
  "Carbon credit tracking on blockchain provides transparent accounting for emissions offsets, potentially reducing fraud and double-counting in environmental markets.",
  "Decentralized science (DeSci) uses blockchain to fund research, share data, and create open access to scientific knowledge outside traditional institutional frameworks.",
  "Blockchain for charitable giving enables donors to track exactly how their contributions are used and verify that funds reach intended recipients, potentially increasing trust in philanthropy.",
  "WAGMI is an acronym for 'We're All Gonna Make It,' expressing optimism about collective success in the web3 community, particularly during market downturns.",
  "DYOR stands for 'Do Your Own Research,' emphasizing the importance of independent investigation before investing in cryptocurrencies or NFT projects.",
  "Airdrops involve distributing tokens or NFTs for free to wallet addresses that meet certain criteria, often used as a marketing strategy or to reward early users.",
  "Community-driven development is central to many web3 projects, with users participating in governance decisions that would traditionally be made by corporate executives.",
  "PFP (Profile Picture) projects are NFT collections designed specifically to be used as social media avatars, often conferring membership in exclusive communities.",
  "Diamond hands is a term used to describe holders who maintain their positions despite market volatility, contrasted with 'paper hands' who sell at the first sign of trouble.",
  "Token-gated content and experiences provide exclusive access to holders of specific NFTs or tokens, creating new models for membership and community engagement.",
  "Pseudonymous founders and developers are common in the web3 space, with many prominent figures known only by their online handles rather than legal identities.",
  "Crypto Twitter refers to the influential community of blockchain enthusiasts, developers, and investors who share news, analysis, and memes on the social media platform.",
  "Hackathons and developer grants are important mechanisms for growing the web3 ecosystem, providing resources and incentives for builders to create new applications.",
  "Initial Coin Offerings (ICOs) allow projects to raise funds by selling tokens to investors, though regulatory scrutiny has reduced their prevalence since the 2017-2018 boom.",
  "Token economics (tokenomics) designs incentive structures that align the interests of network participants, often through utility tokens, governance rights, or staking mechanisms.",
  "Play-to-earn business models allow gamers to earn cryptocurrency or NFTs with real-world value through gameplay, creating new economic opportunities particularly in developing economies.",
  "Enterprise blockchain solutions adapt distributed ledger technology for corporate use cases, often using permissioned networks with known validators rather than fully public systems.",
  "Creator economies in web3 enable direct monetization through NFTs, social tokens, and crowdfunding, potentially reducing reliance on intermediary platforms.",
  "Subscription models using blockchain enable recurring payments with programmable features like automatic cancellation if service levels aren't met.",
  "Protocol revenue in web3 often flows directly to token holders or DAOs rather than traditional corporate entities, creating new models for value capture and distribution.",
  "Composability allows blockchain protocols and applications to integrate with each other like 'money legos,' enabling innovation through recombination of existing components.",
  "Proof-of-attendance protocols (POAPs) provide digital collectibles that verify participation in events, creating new ways to build community and demonstrate engagement history.",
  "Token-curated registries use economic incentives to maintain high-quality lists of resources, venues, or service providers without centralized control.",
];

async function createFixedPointValuesFromText(text, dimension, contract) {
  const normalizedText = text.toLowerCase().replace(/[^\w\s]/g, " ");

  const tokens = normalizedText
    .split(/\s+/)
    .filter((token) => token.length > 0);

  const wordFreq = {};
  for (const word of tokens) {
    if (word.length > 2) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  }

  const sortedWords = Object.keys(wordFreq).sort(
    (a, b) => wordFreq[b] - wordFreq[a]
  );

  const stopwords = [
    "the",
    "and",
    "for",
    "are",
    "with",
    "that",
    "have",
    "this",
    "from",
    "has",
  ];
  const filteredWords = sortedWords.filter((word) => !stopwords.includes(word));

  const featureWords = filteredWords.slice(0, dimension);

  const vector = [];

  for (let i = 0; i < dimension; i++) {
    if (i < featureWords.length) {
      const word = featureWords[i];
      const frequency = wordFreq[word];
      const totalWords = tokens.length;

      const scaledFreq = frequency * 1000;
      const scaledTotal = totalWords * 1000;

      try {
        const value = await contract.toFixedPoint(scaledFreq, 4);
        vector.push(value);
      } catch (error) {
        console.error(`Error creating fixed point value: ${error.message}`);
        vector.push(1);
      }
    } else {
      vector.push(1);
    }
  }

  return vector;
}

function createMetadataFromText(text) {
  const firstWords = text.split(" ").slice(0, 3).join("_");
  return Array.from(Buffer.from(`doc-${firstWords}`));
}

async function testVectorDb() {
  try {
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      wallet
    );

    console.log("Testing VectorDb contract...");

    const initTx = await contract.initialize();
    await initTx.wait();
    console.log("1. Initialized contract");

    const scaleFactor = await contract.getScaleFactor();
    console.log(`   Contract scale factor: ${scaleFactor.toString()}`);

    console.log("2. Checking for existing vectors to delete...");
    const count = await contract.getCount();
    console.log(`   Found ${count.toString()} potential vectors`);

    for (let id = 0; id < count; id++) {
      const exists = await contract.vectorExists(id);
      if (exists) {
        console.log(`   Deleting vector with ID: ${id}`);
        const deleteTx = await contract.deleteVector(id);
        await deleteTx.wait();
      }
    }
    console.log("   Finished deleting existing vectors");

    console.log("3. Adding vectors derived from NFT-related text documents");
    const addedVectorIds = [];
    const numDocuments = sampleDocuments.length;

    console.log(" num of docs: ", numDocuments);

    // for (let i = 0; i < Math.min(3, numDocuments); i++) {
    for (let i = 0; i < numDocuments; i++) {
      const document = sampleDocuments[i];
      try {
        const dimension = 50;
        const components = await createFixedPointValuesFromText(
          document,
          dimension,
          contract
        );
        const metadata = createMetadataFromText(document);

        console.log(
          `   Adding vector ${i + 1} from document: "${document.substring(
            0,
            40
          )}${document.length > 40 ? "..." : ""}"`
        );
        console.log(`   Vector dimensions: ${dimension}`);

        console.log(
          `   First 3 components: [${components
            .slice(0, 3)
            .map((c) => c.toString())
            .join(", ")}...]`
        );

        const addTx = await contract.addVector(components, metadata);
        const receipt = await addTx.wait();

        addedVectorIds.push(i);

        const magSq = await contract.magnitudeSquared(i);
        console.log(`   Vector ${i} magnitude squared: ${magSq.toString()}`);
      } catch (error) {
        console.error(`   Error adding vector ${i}: ${error.message}`);
      }
    }

    console.log("4. Testing semantic similarity between document pairs");
    console.log(
      "   All vectors have the same dimension (10), so we can compare any pair"
    );

    const testPairs = [
      { id1: 0, id2: 1, description: "NFT basics and marketplaces" },
      { id1: 1, id2: 2, description: "NFT marketplaces and standards" },
      { id1: 0, id2: 2, description: "NFTs and standards" },
    ];

    for (const { id1, id2, description } of testPairs) {
      console.log(
        `   Test ${
          testPairs.indexOf({ id1, id2, description }) + 1
        }: ${description} (Documents ${id1} and ${id2})`
      );
      console.log(
        `     Doc ${id1}: "${sampleDocuments[id1].substring(0, 40)}..."`
      );
      console.log(
        `     Doc ${id2}: "${sampleDocuments[id2].substring(0, 40)}..."`
      );

      try {
        const dotTx = await contract.dotProduct(id1, id2);
        await dotTx.wait();
        console.log(`     Dot product calculated (transaction successful)`);

        const magSq1 = await contract.magnitudeSquared(id1);
        const magSq2 = await contract.magnitudeSquared(id2);
        console.log(`     Vector ${id1} magnitude squared: ${magSq1}`);
        console.log(`     Vector ${id2} magnitude squared: ${magSq2}`);

        try {
          const cosTx = await contract.cosineSimilarity(id1, id2);
          await cosTx.wait();
          console.log(
            `     Cosine similarity calculated (transaction successful)`
          );
        } catch (error) {
          console.log(
            `     Error computing cosine similarity: ${error.message}`
          );
        }
      } catch (error) {
        console.log(`     Error computing metrics: ${error.message}`);
      }
    }

    console.log(
      "\n5. Creating a test vector with known values to check magnitude calculation"
    );
    const testDimension = 3;
    const testValues = [];

    try {
      const value1 = await contract.toFixedPoint(10, 1);
      testValues.push(value1);
      console.log(`   Test value 1: ${value1.toString()}`);

      const value2 = await contract.toFixedPoint(5, 1);
      testValues.push(value2);
      console.log(`   Test value 2: ${value2.toString()}`);

      const value3 = await contract.toFixedPoint(25, 2);
      testValues.push(value3);
      console.log(`   Test value 3: ${value3.toString()}`);

      console.log(
        `   Adding test vector with components: [${testValues
          .map((v) => v.toString())
          .join(", ")}]`
      );
      const testMetadata = Array.from(Buffer.from("test-vector"));
      const testVectorTx = await contract.addVector(testValues, testMetadata);
      await testVectorTx.wait();

      const testVectorId = addedVectorIds.length;
      console.log(`   Test vector ID: ${testVectorId}`);

      const testMagSq = await contract.magnitudeSquared(testVectorId);
      console.log(`   Test vector magnitude squared: ${testMagSq.toString()}`);

      const testDotTx = await contract.dotProduct(testVectorId, testVectorId);
      await testDotTx.wait();
      console.log(`   Test vector dot product with itself calculated`);

      addedVectorIds.push(testVectorId);
    } catch (error) {
      console.error(`   Error creating test vector: ${error.message}`);
    }

    console.log("\n6. Analyzing documents for NFT-related information");

    const nftKeywords = [
      "nft",
      "non-fungible",
      //   "token",
      //   "blockchain",
      //   "digital art",
      //   "collectible",
    ];

    const documentScores = [];
    for (const docId of addedVectorIds.slice(0, numDocuments)) {
      console.log(docId);
      if (docId >= sampleDocuments.length) continue;

      const document = sampleDocuments[docId];
      const normalizedDoc = document.toLowerCase();

      let score = 0;
      for (const keyword of nftKeywords) {
        if (normalizedDoc.includes(keyword)) {
          score += 1;
        }
      }

      const nftMatches = (normalizedDoc.match(/nft/g) || []).length;
      score += nftMatches * 2;

      documentScores.push({
        docId,
        score,
        text: document,
      });
    }

    documentScores.sort((a, b) => b.score - a.score);

    console.log("   Top NFT-related documents:");
    for (let i = 0; i < Math.min(3, documentScores.length); i++) {
      const result = documentScores[i];
      console.log(
        `     ${i + 1}. Document ${result.docId} (score: ${result.score})`
      );
      console.log(`        "${result.text.substring(0, 100)}..."`);
    }

    console.log("\n7. Creating and testing a query vector for NFT relevance");

    try {
      const nftQuery =
        "NFT non-fungible token digital ownership blockchain unique collectible";
      console.log(`   Query: "${nftQuery}"`);

      const dimension = 50;
      const queryVector = await createFixedPointValuesFromText(
        nftQuery,
        dimension,
        contract
      );

      console.log(`   Adding query as a temporary vector`);
      const queryMetadata = Array.from(Buffer.from("nft-query"));
      const queryTx = await contract.addVector(queryVector, queryMetadata);
      const queryReceipt = await queryTx.wait();

      const queryId = addedVectorIds.length;
      console.log(`   Query vector ID: ${queryId}`);
      addedVectorIds.push(queryId);

      console.log(
        `   Computing dot product with all documents (measure of relevance):`
      );
      const relevanceScores = [];

      for (const docId of addedVectorIds) {
        if (docId === queryId) continue;

        try {
          const exists = await contract.vectorExists(docId);
          if (!exists) continue;

          if (docId < sampleDocuments.length) {
            const dotTx = await contract.dotProduct(queryId, docId);
            await dotTx.wait();

            const mag = await contract.magnitudeSquared(docId);

            const nftCount = (sampleDocuments[docId].match(/NFT/g) || [])
              .length;

            relevanceScores.push({
              docId,
              nftMentions: nftCount,
              magnitude: mag.toString(),
              text: sampleDocuments[docId],
            });

            console.log(
              `     Doc ${docId}: NFT mentions: ${nftCount}, Magnitude: ${mag}`
            );
          }
        } catch (error) {
          console.log(`     Error processing doc ${docId}: ${error.message}`);
        }
      }

      relevanceScores.sort((a, b) => b.nftMentions - a.nftMentions);

      console.log(`   Top most relevant documents to NFT query (by mentions):`);
      for (let i = 0; i < Math.min(3, relevanceScores.length); i++) {
        const result = relevanceScores[i];
        console.log(
          `     ${i + 1}. Document ${result.docId} (NFT mentions: ${
            result.nftMentions
          })`
        );
        console.log(`        "${result.text.substring(0, 100)}..."`);
      }

      console.log(`   Deleting the temporary query vector (ID: ${queryId})`);
      const deleteQueryTx = await contract.deleteVector(queryId);
      await deleteQueryTx.wait();
    } catch (error) {
      console.error(`   Error in NFT query test: ${error.message}`);
    }

    const finalCount = await contract.getCount();
    console.log(`\n8. Final vector count: ${finalCount}`);

    const deleteId = 0;
    console.log(
      `9. Deleting document vector ${deleteId}: "${sampleDocuments[
        deleteId
      ].substring(0, 40)}..."`
    );
    const deleteTx = await contract.deleteVector(deleteId);
    await deleteTx.wait();

    const existsAfter = await contract.vectorExists(deleteId);
    console.log(`   Vector ${deleteId} exists after deletion: ${existsAfter}`);

    console.log("All tests completed successfully!");
  } catch (error) {
    console.error("Error during testing:", error);
  }
}

testVectorDb()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
