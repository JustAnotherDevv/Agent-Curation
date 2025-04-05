# Curation Agent

## Overview

Curation agent is AI agent focused on collecting, filtering and curating news sources, posts and messages for the Akasha Network Core to prevent spam, fake news and gather information from third-aprty sources.

## Features

- First ever onchain vector database built with Arbitrum Stylus smart contracts for storage, retrieval and comparisons of vectorized documents.
- Automated crypto news articles collection and cleanup thanks to webscraping cointelegraph
- news summarization, categorization and curation by AI
- Akasha app using Akasha devkit with AI-powered feeds, custom filters and curation powered by AI agent.

## Bounties

- **Main Tack**
- **Arbitrum Stylus**
- **Akasha Network**

```mermaid
flowchart TD
    subgraph ext["External Data Sources"]
        A1[Cointelegraph RSS] --> |Web Scraping| C1
        A2[Other Data Sources] --> |Coming Soon| C1
    end

    subgraph proc["AI Processing Layer"]
        C1[Data Collection Engine]
        C2[Content Listener]
        C3[AI Moderation Engine]
        C4[Vector Embedding]
        C5[Classification & Categorization]
        C6[Summarization]

        C1 --> C3
        C2 --> C3
        C3 --> C4
        C3 --> C5
        C3 --> C6
        C5 --> C4
        C6 --> C4
    end

    subgraph storage["Storage Layer"]
        D1[(Arbitrum Stylus\nVector Database)]
        D2[(Metadata Store)]
        D3[(Content Cache)]
        
        C4 --> D1
        C5 --> D2
        C6 --> D3
    end

    subgraph filter["Filter & Decision Layer"]
        E1{Quality Filter}
        E2{Spam Detection}
        E3{Fake News Classifier}
        E4{Content Relevance}
        
        D1 --> E1
        D1 --> E2
        D1 --> E3
        D2 --> E4
    end

    subgraph akasha["Akasha Integration"]
        F1[AI-Powered Feed]
        F2[Custom Filters]
        F3[Community Notes]
        F4[Moderation UI]
        
        E1 --> F1
        E2 --> F1
        E3 --> F1
        E4 --> F1
        
        F1 --> F2
        F1 --> F3
        F3 --> F4
    end

    classDef blueBox fill:#d0e8ff,stroke:#3080c0,stroke-width:2px
    classDef greenBox fill:#d0ffe0,stroke:#30a050,stroke-width:2px
    classDef purpleBox fill:#e0d0ff,stroke:#6030a0,stroke-width:2px
    classDef orangeBox fill:#ffe0d0,stroke:#e07030,stroke-width:2px
    classDef redBox fill:#ffd0d0,stroke:#a03030,stroke-width:2px
    
    class ext blueBox
    class proc greenBox
    class storage purpleBox
    class filter orangeBox
    class akasha redBox
```

## Business Plan

### Problem

Currently all major social networks and communities suffer from severe information pollution issues:

- Information Overload: Users are bombarded with thousands of articles, posts, and updates daily, making it impossible to distinguish signal from noise.
- Rampant Misinformation: as example the web3 space is plagued by fake news, pump-and-dump schemes, and misleading information that often leads to financial losses.
- Targeted Spam: Advanced bots and spammers target crypto communities with scams, phishing attempts, and malicious links.
- Siloed Data: Valuable information is scattered across platforms, making good research time-consuming and inefficient.
- Centralized Moderation: Current content moderation systems are typically black boxes controlled by centralized entities, creating trust issues and potential censorship concerns.

### Solution

Curation Agent provides a comprehensive solution through a multi-tiered approach:

- **Stylus Onchain Vector Db** - Semantic search and comparison of content across platforms
- **News Feed** - AI-powered personalization and curation without the problematic filter bubbles of traditional algorithms

### Target Users

1. Crypto Enthusiasts & Investors

2. Content Creators & Journalists

3. Akasha Network Members

## Revenue Streams

Freemium Model for End Users

- Basic access free for all users
  - Premium subscription ($5-15/month) for advanced features, custom filters, and API access
- Token Economy
  -Incentivization for quality curation and vector db data contributions

### 🌍 Impact & Ecosystem Fit

Curation Agent addresses critical infrastructure needs for the social networks. By combining AI with community verification on a blockchain it creates a trustworthy information environment that is resistant to manipulation and censorship.

## Setup

### Stylus

-

### AI Agent

- `cd /scripts`
- `npm i`
- test Stylus onchain vector db - `node test-vectordb.js`

### Akasha

-
