
// Import Web3 library
const Web3 = require('web3');
require('dotenv').config();

// Initialize Web3 instance with an Ethereum node provider (e.g., Infura)
const web3 = new Web3(process.env.RPC_URL);
function createWallet() {
    const account = web3.eth.accounts.create();
    const privateKey = account.privateKey;
    const publicAddress = account.address;

    return { privateKey, publicAddress };
}

// Function to check the ETH balance of a given address
async function checkEthBalance(address) {
    try {
        const balanceWei = await web3.eth.getBalance(address);
        const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
        return balanceEth;
    } catch (error) {
        console.error('Error checking balance:', error);
        throw error;
    }
}

// Function to send funds from one wallet to another
const sendFunds = async (fromWallet, toWallet, amount , privateKey) => {
    try {
        // const privateKey = 'YOUR_MAIN_WALLET_PRIVATE_KEY'; // You need the private key of the sending wallet
        const fromAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
        web3.eth.accounts.wallet.add(fromAccount);

        // Create and sign the transaction
        const tx = {
            from: fromWallet,
            to: toWallet,
            value: web3.utils.toWei(amount.toString(), 'ether'), // Convert Ether to Wei
            gas: 21000, // Gas limit for a simple ETH transfer
        };

        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log(`Transaction successful with hash: ${receipt.transactionHash}`);
    } catch (error) {
        console.error(`Error sending funds from ${fromWallet} to ${toWallet}:`, error);
        throw new Error('Error sending funds.');
    }
};

module.exports = {
    createWallet,
    checkEthBalance,
    sendFunds
};
