// Smooth scrolling for navigation
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const section = document.querySelector(this.getAttribute('href'));
        section.scrollIntoView({ behavior: 'smooth' });
    });
});

// CTA button alerts
document.querySelectorAll('.cta-button').forEach(button => {
    if (button.id !== 'connect-wallet') {
        button.addEventListener('click', () => {
            if (button.textContent.includes('Swap')) {
                alert('Enter the NINTINDEL Galaxy! Swap $TIN on PulseX and HODL tight!');
            } else if (button.textContent.includes('Join')) {
                alert('Join the $TIN revolution! Follow @Tindel10 on X for epic vibes!');
            }
        });
    }
});

// Mock community feed
const communityGrid = document.querySelector('.community-grid');
const mockPosts = [
    { content: '<img src="tin-sorcerer.png" alt="TIN Sorcerer Art">', link: '#' },
    { content: 'Latest @Tindel10 Post: $TIN soars! 🚀', link: 'https://x.com/Tindel10' },
    { content: '<img src="tin-meme.png" alt="$TIN Meme">', link: '#' }
];

mockPosts.forEach(post => {
    const card = document.createElement('div');
    card.className = 'community-card';
    card.innerHTML = post.link ? `<a href="${post.link}" target="_blank">${post.content}</a>` : post.content;
    communityGrid.appendChild(card);
});

// MetaMask integration
const connectWalletButton = document.getElementById('connect-wallet');
const walletInfo = document.getElementById('wallet-info');
const TIN_CONTRACT_ADDRESS = '0xd4744e6764507425E501824583Bec8e855B6dF57';
const PULSECHAIN_NETWORK = {
    chainId: '0x3ad', // PulseChain mainnet (chainId 941)
    chainName: 'PulseChain',
    rpcUrls: ['https://rpc.pulsechain.com'],
    nativeCurrency: { name: 'Pulse', symbol: 'PLS', decimals: 18 },
    blockExplorerUrls: ['https://scan.pulsechain.com']
};
const TIN_ABI = [
    {
        constant: true,
        inputs: [{ name: '_owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: 'balance', type: 'uint256' }],
        type: 'function'
    }
];

async function connectWallet() {
    if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask to connect your wallet!');
        return;
    }

    try {
        // Request account access
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];

        // Switch to PulseChain
        try {
            await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: PULSECHAIN_NETWORK.chainId }]
            });
        } catch (switchError) {
            if (switchError.code === 4902) {
                await ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [PULSECHAIN_NETWORK]
                });
            } else {
                throw switchError;
            }
        }

        // Get $TIN balance
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(TIN_CONTRACT_ADDRESS, TIN_ABI, provider);
        const balance = await contract.balanceOf(account);
        const balanceInTIN = ethers.utils.formatUnits(balance, 18);

        walletInfo.textContent = `Wallet: ${account} | $TIN Balance: ${balanceInTIN}`;
    } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Failed to connect wallet. Ensure MetaMask is set up for PulseChain.');
    }
}

connectWalletButton.addEventListener('click', connectWallet);