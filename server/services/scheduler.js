const { fetchAndUpsertCoins } = require('./coinPriceService');

setInterval(() => {
  fetchAndUpsertCoins([
    { name: 'bitcoin', description: 'The original cryptocurrency' },
    { name: 'ethereum', description: 'Ethereum decentralized blockchain' },
    { name: 'ripple', description: 'Blockchain-based payment platform' },
    { name: 'cardano', description: 'Cardano decentralized blockchain' },
    { name: 'solana', description: 'Solana decentralized blockchain' },
  ]).catch((err) => {
    // Error already logged in service
  });
}, 1800000);
