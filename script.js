async function connectWallet() {
  if (window.ethereum) {
    try {
      // Connect wallet
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      // Try switching to PulseChain
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x171' }], // PulseChain Mainnet
        });
      } catch (switchError) {
        // If PulseChain not added, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x171', // 369
              chainName: 'PulseChain',
              rpcUrls: ['https://rpc.pulsechain.com'],
              nativeCurrency: { name: 'Pulse', symbol: 'PLS', decimals: 18 },
              blockExplorerUrls: ['https://otter.pulsechain.com']
            }],
          });
        } else {
          throw switchError;
        }
      }
      console.log('Connected to PulseChain');
      // Update button text
      document.getElementById('connectButton').innerText = 'Connected';
    } catch (error) {
      console.error('Connection failed:', error);
      alert('Failed to connect. Check MetaMask and PulseChain settings.');
    }
  } else {
    alert('MetaMask not installed! Install at https://metamask.io');
  }
}
