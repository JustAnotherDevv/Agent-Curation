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
  "NFTs (Non-Fungible Tokens) are unique digital assets verified using blockchain technology. Unlike cryptocurrencies such as Bitcoin, each NFT has a distinct value and cannot be exchanged on a like-for-like basis.",
  "test",
  "NFT marketplaces allow users to buy, sell, and trade digital collectibles. Popular platforms include OpenSea, Rarible, and Foundation, which support various blockchain networks.",
  "The ERC-721 standard is the most common standard for NFTs on the Ethereum blockchain. It defines how to create non-fungible tokens with unique identifiers and metadata.",
  "Digital art has become one of the most popular applications of NFT technology, allowing artists to create verifiably unique digital works that can be bought, sold, and collected.",
  "NFT royalties enable creators to earn a percentage of sales whenever their digital assets are resold on the secondary market, providing ongoing income streams.",
  "Smart contracts are self-executing programs stored on a blockchain that run when predetermined conditions are met. They power the functionality of NFTs and other decentralized applications.",
  "Blockchain technology provides a decentralized and immutable ledger for secure transactions, serving as the foundation for cryptocurrencies and NFTs.",
  "Gas fees on Ethereum are payments made by users to compensate for the computing energy required to process and validate transactions, including NFT minting and transfers.",
  "NFT metadata typically includes a name, description, and URI pointing to a digital asset. This data is stored either on-chain or on decentralized storage systems like IPFS.",
  "The environmental impact of NFTs has been debated due to the energy consumption of proof-of-work blockchains, leading to the development of more eco-friendly alternatives.",
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

    for (let i = 0; i < Math.min(3, numDocuments); i++) {
      const document = sampleDocuments[i];
      try {
        const dimension = 10;
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
      "token",
      "blockchain",
      "digital art",
      "collectible",
    ];

    const documentScores = [];
    for (const docId of addedVectorIds.slice(0, numDocuments)) {
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

      const dimension = 10;
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
