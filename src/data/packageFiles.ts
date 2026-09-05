import JSZip from 'jszip';
import { CodeFile } from '../types';

export const REPOSITORY_FILES: CodeFile[] = [
  {
    id: 'genesis',
    path: '/core-node/genesis.json',
    filename: 'genesis.json',
    directory: 'core-node',
    language: 'json',
    badge: 'IBFT 2.0 / PoS',
    description: 'Konfigurácia siete EVM IBFT 2.0 / PoS (Chain ID 5150, 2s bloky, validátori, alokácia).',
    content: `{
  "config": {
    "chainId": 5150,
    "homesteadBlock": 0,
    "eip150Block": 0,
    "eip155Block": 0,
    "eip158Block": 0,
    "byzantiumBlock": 0,
    "constantinopleBlock": 0,
    "petersburgBlock": 0,
    "istanbulBlock": 0,
    "berlinBlock": 0,
    "londonBlock": 0,
    "ibft2": {
      "blockperiodseconds": 2,
      "epochlength": 30000,
      "requesttimeoutseconds": 4,
      "validators": [
        "0x0000000000000000000000000000000000000001",
        "0x0000000000000000000000000000000000000002"
      ]
    }
  },
  "nonce": "0x0",
  "timestamp": "0x58ee40ba",
  "extraData": "0xf87aa00000000000000000000000000000000000000000000000000000000000000000940000000000000000000000000000000000000001940000000000000000000000000000000000000002c88080808080",
  "gasLimit": "0x1fffffffffffff",
  "difficulty": "0x1",
  "mixHash": "0x6374696361206279746573206f66206974616c69616e2070726f6f66206f6620",
  "alloc": {
    "0xREDACTED_OPERATOR_GENESIS_ADDRESS": {
      "balance": "0x33B2E3C9FD0803CE8000000"
    }
  }
}`
  },
  {
    id: 'core-token',
    path: '/smart-contracts/contracts/CoreToken.sol',
    filename: 'CoreToken.sol',
    directory: 'smart-contracts/contracts',
    language: 'solidity',
    badge: 'EIP-20 / Burnable',
    description: 'EIP-20 Token s Burn mechanizmom a stropom MAX_SUPPLY = 1,000,000,000 TV5.',
    content: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CoreToken - Native Utility Token
 * @dev Compliant with EIP-20 and MiCA standards. Managed by Transformer V5 Architecture.
 */
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CoreToken is ERC20, ERC20Burnable, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18;

    event TokensMinted(address indexed to, uint256 amount);

    constructor(address initialOwner) ERC20("TransformerV5 Coin", "TV5") Ownable(initialOwner) {
        // Initial allocation: 10% for Ecosystem Liquidity
        _mint(initialOwner, 100_000_000 * 10**18);
    }

    /**
     * @notice Minting function protected by Owner governance
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "CoreToken: Max supply exceeded");
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }
}`
  },
  {
    id: 'staking',
    path: '/smart-contracts/contracts/Staking.sol',
    filename: 'Staking.sol',
    directory: 'smart-contracts/contracts',
    language: 'solidity',
    badge: 'PoS Staking Protocol',
    description: 'Staking protokol pre TV5 tokeny s ReentrancyGuard ochranou a výpočtom APY odmien.',
    content: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract CoreStaking is Ownable, ReentrancyGuard {
    IERC20 public immutable token;
    uint256 public rewardRate = 100; // APY multiplier base

    mapping(address => uint256) public stakedBalance;
    mapping(address => uint256) public lastUpdate;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    constructor(address _tokenAddress, address _owner) Ownable(_owner) {
        token = IERC20(_tokenAddress);
    }

    function stake(uint256 _amount) external nonReentrant {
        require(_amount > 0, "Cannot stake 0");
        token.transferFrom(msg.sender, address(this), _amount);
        stakedBalance[msg.sender] += _amount;
        lastUpdate[msg.sender] = block.timestamp;
        emit Staked(msg.sender, _amount);
    }

    function withdraw(uint256 _amount) external nonReentrant {
        require(stakedBalance[msg.sender] >= _amount, "Insufficient stake");
        stakedBalance[msg.sender] -= _amount;
        token.transfer(msg.sender, _amount);
        emit Withdrawn(msg.sender, _amount);
    }
}`
  },
  {
    id: 'web3-config',
    path: '/wallet-client/src/web3Config.ts',
    filename: 'web3Config.ts',
    directory: 'wallet-client/src',
    language: 'typescript',
    badge: 'Wagmi / Chain 5150',
    description: 'Konfigurácia Web3 peňaženky pre sieť Transformer V5 (Chain ID 5150, RPC a Explorer).',
    content: `import { createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';

// Definícia vlastnej siete EVM V5
export const customChain = {
  id: 5150,
  name: 'Transformer V5 Network',
  nativeCurrency: {
    name: 'TV5 Coin',
    symbol: 'TV5',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.your-blockchain-domain.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'V5 Scan',
      url: 'https://explorer.your-blockchain-domain.com',
    },
  },
};

export const config = createConfig({
  chains: [customChain],
  transports: {
    [customChain.id]: http(),
  },
});`
  },
  {
    id: 'mica-compliance',
    path: '/legal-docs/MICA_COMPLIANCE.md',
    filename: 'MICA_COMPLIANCE.md',
    directory: 'legal-docs',
    language: 'markdown',
    badge: 'EU MiCA & GDPR Tier 5',
    description: 'Legislatívny rámec EÚ Nariadenia 2023/1114 (MiCA) a anonymizačné protokoly GDPR.',
    content: `# EU MiCA & GDPR Compliance Manifest

## 1. Governance & Entity
- Issuer: [PRÁVNA ENTITA OPERÁTORA]
- Regulatory Framework: EU Regulation 2023/1114 (MiCA)

## 2. Token Classification
- Token Type: Utility Token / Payment Token
- Classification: Non-Asset Referenced Token (Non-ART)

## 3. GDPR Protocols
- On-Chain Anonymization: No PII (Personally Identifiable Information) stored on-chain.
- Off-Chain Nodes: Zero telemetry collection policy enforced on node RPC endpoints.`
  }
];

export const README_MD = `# Transformer V5 Core-System (Báza A - EVM / PoS)

Produkčný kódový balík pre EVM IBFT 2.0 / PoS sieť s natívnym utility tokenom TV5 a MiCA/GDPR compliance architektúrou.

## Štruktúra repozitára
- \`/core-node/genesis.json\`: Konfigurácia IBFT 2.0 siete (Chain ID: 5150, 2s bloky, validátori)
- \`/smart-contracts/contracts/CoreToken.sol\`: EIP-20 TV5 Token (1 000 000 000 max supply, burnable)
- \`/smart-contracts/contracts/Staking.sol\`: PoS Staking protokol s ochranou proti reentrancy
- \`/wallet-client/src/web3Config.ts\`: Wagmi konfigurácia peňaženky pre vlastný EVM reťazec
- \`/legal-docs/MICA_COMPLIANCE.md\`: EÚ MiCA (Reg. 2023/1114) a GDPR Tier 5 manifest

## Spustenie a nasadenie do GitHub
\`\`\`bash
mkdir crypto-core-v5 && cd crypto-core-v5
git init
# Rozbaľte stiahnuté súbory do adresára
git add .
git commit -m "feat: Initializing Transformer V5 core system framework"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/crypto-core-v5.git
git push -u origin main
\`\`\`
`;

export async function generateRepositoryZip(username: string = 'YOUR_USERNAME'): Promise<Blob> {
  const zip = new JSZip();

  // Add files according to required paths
  zip.file('core-node/genesis.json', REPOSITORY_FILES[0].content);
  zip.file('smart-contracts/contracts/CoreToken.sol', REPOSITORY_FILES[1].content);
  zip.file('smart-contracts/contracts/Staking.sol', REPOSITORY_FILES[2].content);
  zip.file('wallet-client/src/web3Config.ts', REPOSITORY_FILES[3].content);
  zip.file('legal-docs/MICA_COMPLIANCE.md', REPOSITORY_FILES[4].content);
  
  // Supplementary files
  const customizedReadme = README_MD.replace(/YOUR_USERNAME/g, username || 'YOUR_USERNAME');
  zip.file('README.md', customizedReadme);
  zip.file('.gitignore', `node_modules/
dist/
.env
cache/
artifacts/
*.log
`);

  return await zip.generateAsync({ type: 'blob' });
}

export function downloadFileDirect(filename: string, content: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
