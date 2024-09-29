// controllers/walletController.js
const Wallet = require('../model/WalletModel');
// controllers/walletController.js
const { createWallet, checkEthBalance , sendFunds } = require('../utils/walletUtils');
const Web3 = require('web3');
require('dotenv').config();
const crypto = require('crypto');
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/5601b128359145ae86041a34469e2dab'));
const User = require('../model/UserModel');
const algorithm = 'aes-256-cbc';
const secretKey = process.env.ENCRYPTION_KEY;
const ivLength = 16;

// Function to encrypt data
function encrypt(text) {
    if (!text || typeof text !== 'string') {
        throw new Error('Invalid text for encryption');
    }
    if (!secretKey || typeof secretKey !== 'string') {
        throw new Error('Encryption key is not defined or is not a string');
    }

    const iv = crypto.randomBytes(ivLength); // Generate a random IV
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}


// Function to decrypt data
function decrypt(text) {
    try {
        const textParts = text.split(':');
        if (textParts.length !== 2) {
            throw new Error('Invalid encrypted text format');
        }

        const iv = Buffer.from(textParts[0], 'hex'); // Extract IV
        const encryptedText = Buffer.from(textParts[1], 'hex'); // Extract the encrypted text

        const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error.message);
        throw new Error('Failed to decrypt the text');
    }
}


const routerAbi = [{ "inputs": [{ "internalType": "address", "name": "_factory", "type": "address" }, { "internalType": "address", "name": "_WETH", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [], "name": "WETH", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "tokenA", "type": "address" }, { "internalType": "address", "name": "tokenB", "type": "address" }, { "internalType": "uint256", "name": "amountADesired", "type": "uint256" }, { "internalType": "uint256", "name": "amountBDesired", "type": "uint256" }, { "internalType": "uint256", "name": "amountAMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountBMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "addLiquidity", "outputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "amountB", "type": "uint256" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "amountTokenDesired", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "addLiquidityETH", "outputs": [{ "internalType": "uint256", "name": "amountToken", "type": "uint256" }, { "internalType": "uint256", "name": "amountETH", "type": "uint256" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "factory", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "uint256", "name": "reserveIn", "type": "uint256" }, { "internalType": "uint256", "name": "reserveOut", "type": "uint256" }], "name": "getAmountIn", "outputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "reserveIn", "type": "uint256" }, { "internalType": "uint256", "name": "reserveOut", "type": "uint256" }], "name": "getAmountOut", "outputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }], "name": "getAmountsIn", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }], "name": "getAmountsOut", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "reserveA", "type": "uint256" }, { "internalType": "uint256", "name": "reserveB", "type": "uint256" }], "name": "quote", "outputs": [{ "internalType": "uint256", "name": "amountB", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "tokenA", "type": "address" }, { "internalType": "address", "name": "tokenB", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountAMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountBMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "removeLiquidity", "outputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "amountB", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "removeLiquidityETH", "outputs": [{ "internalType": "uint256", "name": "amountToken", "type": "uint256" }, { "internalType": "uint256", "name": "amountETH", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "removeLiquidityETHSupportingFeeOnTransferTokens", "outputs": [{ "internalType": "uint256", "name": "amountETH", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "bool", "name": "approveMax", "type": "bool" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "removeLiquidityETHWithPermit", "outputs": [{ "internalType": "uint256", "name": "amountToken", "type": "uint256" }, { "internalType": "uint256", "name": "amountETH", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "bool", "name": "approveMax", "type": "bool" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "removeLiquidityETHWithPermitSupportingFeeOnTransferTokens", "outputs": [{ "internalType": "uint256", "name": "amountETH", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "tokenA", "type": "address" }, { "internalType": "address", "name": "tokenB", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountAMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountBMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "bool", "name": "approveMax", "type": "bool" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "removeLiquidityWithPermit", "outputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "amountB", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapETHForExactTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactETHForTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactETHForTokensSupportingFeeOnTransferTokens", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForETH", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForETHSupportingFeeOnTransferTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForTokensSupportingFeeOnTransferTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "uint256", "name": "amountInMax", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapTokensForExactETH", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "uint256", "name": "amountInMax", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapTokensForExactTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, { "stateMutability": "payable", "type": "receive" }]
const erc20Abi = [{"inputs":[{"internalType":"address","name":"_marketing","type":"address"},{"internalType":"address","name":"_team","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amountETH","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountTokens","type":"uint256"}],"name":"AutoLiquify","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"TradingOpen","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_maxTxAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_maxWalletToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"holder","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"approveAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"accounts","type":"address[]"},{"internalType":"bool","name":"state","type":"bool"}],"name":"bulkIsBlacklisted","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountPercentage","type":"uint256"}],"name":"clearStuckETH","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"clearStuckToken","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"bool","name":"_enabled","type":"bool"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"editSwapbackSettings","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_open","type":"bool"},{"internalType":"uint256","name":"_buyMultiplier","type":"uint256"},{"internalType":"uint256","name":"_sellMultiplier","type":"uint256"},{"internalType":"uint256","name":"_transferMultiplier","type":"uint256"}],"name":"enableTrading","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"holder","type":"address"},{"internalType":"bool","name":"exempt","type":"bool"}],"name":"exemptAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getCirculatingSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"accuracy","type":"uint256"}],"name":"getLiquidityBacking","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"target","type":"uint256"},{"internalType":"uint256","name":"accuracy","type":"uint256"}],"name":"isOverLiquified","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pair","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"removeMaxLimits","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"router","outputs":[{"internalType":"contract IDEXRouter","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_buy","type":"uint256"},{"internalType":"uint256","name":"_sell","type":"uint256"},{"internalType":"uint256","name":"_trans","type":"uint256"}],"name":"setFees","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"maxTXPercent","type":"uint256"}],"name":"setMaxTx","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"maxWallPercent","type":"uint256"}],"name":"setMaxWallet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"holder","type":"address"},{"internalType":"bool","name":"exempt","type":"bool"}],"name":"setTXExempt","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_target","type":"uint256"},{"internalType":"uint256","name":"_denominator","type":"uint256"}],"name":"setTargets","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"swapEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"swapThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"swapback","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"totalFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"transfer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bool","name":"state","type":"bool"}],"name":"updateIsBlacklisted","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_autoLiquidityReceiver","type":"address"},{"internalType":"address","name":"_marketingFeeReceiver","type":"address"},{"internalType":"address","name":"_utilityFeeReceiver","type":"address"},{"internalType":"address","name":"_burnFeeReceiver","type":"address"},{"internalType":"address","name":"_teamFeeReceiver","type":"address"}],"name":"updateReceiverWallets","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_liquidityFee","type":"uint256"},{"internalType":"uint256","name":"_teamFee","type":"uint256"},{"internalType":"uint256","name":"_marketingFee","type":"uint256"},{"internalType":"uint256","name":"_utilityFee","type":"uint256"},{"internalType":"uint256","name":"_burnFee","type":"uint256"},{"internalType":"uint256","name":"_feeDenominator","type":"uint256"}],"name":"updateTaxBreakdown","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];


const routerAddress = process.env.PANCAKESWAP_ROUTER_ADDRESS;
const RPC_URL = process.env.RPC_URL;

// Function to get the current gas price
async function getGasPrice(web3) {
    return await web3.eth.getGasPrice();
}

// Function to execute a transaction
async function executeTransaction(web3, txData) {
    try {
        const receipt = await web3.eth.sendTransaction(txData);
        console.log('Transaction successful! Hash:', receipt.transactionHash);
        return receipt.transactionHash;
    } catch (error) {
        console.error('Transaction failed:', error);
        throw error;
    }
}




async function executeBatchTransactions(tokenAddress, correspondingData) {
    try {
        const router = new web3.eth.Contract(routerAbi, routerAddress);

        const receipts = await Promise.all(correspondingData.map(async (data, index) => {
            const { privateKey, tokenAmount } = data;

            const ethAmountInWei = web3.utils.toWei(tokenAmount.toString(), 'ether'); 

            const senderAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
            web3.eth.accounts.wallet.add(senderAccount);

            const nonce = await web3.eth.getTransactionCount(senderAccount.address);
            const gasPrice = await web3.eth.getGasPrice();

            // Define the path for the swap: ETH (BNB) -> Token
            const path = [BNB_ADDRESS, tokenAddress]; // Swap ETH/BNB for the token

            // Set a deadline for the swap (10 minutes from the current time)
            const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

            // Prepare the transaction data for swapping ETH to the token
            const tx = {
                to: routerAddress,
                data: router.methods.swapExactETHForTokensSupportingFeeOnTransferTokens(
                    web3.utils.toHex(0), // Minimum amount of tokens to receive (set to 0 for now)
                    path,
                    senderAccount.address, // The wallet receiving the tokens
                    deadline
                ).encodeABI(),
                value: ethAmountInWei, // The ETH amount to swap (in Wei)
                gas: 2000000, // Adjust gas limit as needed
                gasPrice: gasPrice,
                nonce: nonce
            };

            // Sign the transaction with the private key
            const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

            // Send the signed transaction and wait for the receipt
            const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            console.log(`Transaction successful for wallet: ${senderAccount.address}`);

            // Return the receipt for this transaction
            return receipt;
        }));

        return receipts; // Return all the transaction receipts
    } catch (error) {
        console.error('Batch transaction error:', error);
        throw error; // Propagate the error up
    }
}


// Example usage
exports.enableTradingAndBuyToken = async (req, res) => {

    const { tokenAddress, correspondingData } = req.body;

    // Check if the required data is present
    if (!tokenAddress || !correspondingData || correspondingData.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields (tokenAddress or correspondingData)'
        });
    }

    try {
        // Execute batch transactions for buying tokens using ETH
        const receipts = await executeBatchTransactions(tokenAddress, correspondingData);

        // Respond with the transaction receipts
        res.status(200).json({
            success: true,
            message: 'Tokens bought successfully for all wallets',
            receipts
        });
    } catch (error) {
        // Handle any errors during the process
        res.status(500).json({
            success: false,
            message: 'Failed to buy tokens with ETH',
            error: error.message
        });
    }
};


exports.generateWallets = async (req, res) => {
    const { number } = req.body;

    if (!number || typeof number !== 'number' || number <= 0) {
        return res.status(400).json({ message: 'Please provide a valid number of wallets to generate.' });
    }

    const newWallets = []; // Array to hold all new wallet objects

    try {
        for (let i = 0; i < number; i++) {
            // Create a new wallet
            const { privateKey, publicAddress } = createWallet();

            // Encrypt the private key before saving
            const encryptedPrivateKey = encrypt(privateKey);

            // Store wallet details
            const newWallet = new Wallet({
                walletAddress: publicAddress,
                privateKey: encryptedPrivateKey, // Save the encrypted private key
                userId: req.user._id // Assume req.user is populated with the authenticated user's ID
            });

            // Save the wallet to the database
            const savedWallet = await newWallet.save();

            // Add the saved wallet to the response list (excluding the private key for security)
            newWallets.push({
                _id: savedWallet._id,
                walletAddress: savedWallet.walletAddress,
                userId: savedWallet.userId
            });
        }

        // Return the generated wallets
        res.json({
            message: `${number} wallets generated and saved successfully.`,
            wallets: newWallets, // Return all new wallets
        });
    } catch (error) {
        console.error('Error generating wallets:', error);
        res.status(500).json({ message: 'Error generating wallets', error: error.message });
    }
};

exports.generateMainWallet = async (req, res) => {
    try {
        // Step 1: Get userId from req.user
        const userId = req.user._id;

        // Step 2: Fetch the user from the database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Step 3: Create a new wallet
        const { privateKey, publicAddress } = createWallet();

        // Step 4: Encrypt the private key before saving
        const encryptedPrivateKey = encrypt(privateKey);

        // Step 5: Store the new wallet in the Wallet collection
        const newWallet = new Wallet({
            walletAddress: publicAddress,
            privateKey: encryptedPrivateKey, // Save the encrypted private key
            userId: userId // Associate wallet with user
        });

        const savedWallet = await newWallet.save();

        // Step 6: Update the user's mainWallet field with the new wallet's _id
        user.mainWallet = savedWallet._id;

        // Step 7: Save the updated user with the mainWallet reference
        await user.save();

        // Step 8: Return the generated wallet information
        res.json({
            message: 'Main Wallet generated and saved successfully.',
            wallet: savedWallet
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.autoFundingToSubWallets = async (req, res) => {
    try {
        const { wallet , privateKey } = req.body; // Wallet address from the request body
        // console.log(wallet , privateKey);
        // Step 1: Get userId from req.user
        const userId = req.user._id;

        // Step 2: Retrieve the main wallet for the user
        const user = await User.findById(userId).populate('mainWallet');
        if (!user || !user.mainWallet) {
            return res.status(404).json({ message: 'User or main wallet not found.' });
        }

        // Step 3: Check if the provided wallet matches the user's main wallet address
        if (wallet !== user.mainWallet.walletAddress) {
            return res.status(400).json({ message: 'Provided wallet does not match the user\'s main wallet.' });
        }

        // Step 4: Check the balance of the main wallet
        const mainWalletBalance = await checkEthBalance(user.mainWallet.walletAddress); // Assuming getWalletBalance is a function that fetches ETH balance
        if (mainWalletBalance <= 0) {
            return res.status(400).json({ message: 'Insufficient balance in the main wallet.' });
        }

        // Step 5: Retrieve all sub-wallets (excluding the main wallet)
        const subWallets = await Wallet.find({
            userId: userId,
            _id: { $ne: user.mainWallet._id } // Exclude the main wallet
        });

        // Step 6: Check if sub-wallets were found
        if (!subWallets || subWallets.length === 0) {
            return res.status(404).json({ message: 'No sub-wallets found for this user.' });
        }

        // Step 7: Calculate the amount to transfer to each sub-wallet
        const amountPerWallet = mainWalletBalance / subWallets.length;

        // Step 8: Transfer the funds equally to each sub-wallet
        for (const subWallet of subWallets) {
            await sendFunds(user.mainWallet.walletAddress, subWallet.walletAddress, amountPerWallet , privateKey); // Assuming sendFunds is a function to send ETH
        }

        // Step 9: Return a success response
        return res.status(200).json({ message: 'Funding successful to all sub-wallets.', fundedWallets: subWallets });
    } catch (error) {
        // Handle errors
        console.error('Error during auto-funding:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};








// Generate Wallets and Check Balances
exports.getWalletById = async (req, res) => {
    try {
        const wallet = await Wallet.findById(req.params.id);

        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }

        res.status(200).json(wallet);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving wallet', error });
    }
};

exports.getWalletsByUserId = async (req, res) => {

    const userId = req.user.id;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const wallets = await Wallet.find({ userId });
        if (wallets.length === 0) {
            return res.status(404).json({ message: 'No wallets found for this user' });
        }

        // Decrypt private keys before sending
        const decryptedWallets = await Promise.all(wallets.map(async wallet => {
            try {
                return {
                    _id: wallet._id,
                    walletAddress: wallet.walletAddress,
                    privateKey: decrypt(wallet.privateKey), // Decrypt private key
                    userId: wallet.userId
                };
            } catch (error) {
                console.error('Decryption failed for wallet:', wallet.walletAddress, error);
                return null;
            }
        }));

        // Filter out any null values that might have resulted from decryption errors
        const validDecryptedWallets = decryptedWallets.filter(wallet => wallet !== null);

        res.status(200).json({ wallets: validDecryptedWallets });
    } catch (error) {
        console.error('Error retrieving wallets:', error);
        res.status(500).json({ message: 'Error retrieving wallets', error });
    }
};

// Update Wallet
exports.updateWallet = async (req, res) => {
    const { walletAddress, privateKey } = req.body;

    try {
        let wallet = await Wallet.findById(req.params.id);

        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }

        wallet.walletAddress = walletAddress || wallet.walletAddress;
        wallet.privateKey = privateKey || wallet.privateKey;

        wallet = await wallet.save();
        res.status(200).json(wallet);
    } catch (error) {
        res.status(500).json({ message: 'Error updating wallet', error });
    }
};

// Delete Wallet
exports.deleteWallet = async (req, res) => {
    const id = req.params.id;
    try {
        const wallet = await Wallet.findById(id);
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }

        await wallet.deleteOne()
        res.status(200).json({ message: 'Wallet deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting wallet', error });
    }
};