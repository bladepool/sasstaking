var currentAddr;
var networkID = 0;
var masterChef = null;
var web3 = null;
var tempWeb3 = null;

var tokenSAS = null;

//var tokenPerBlock = 48;

window.addEventListener('load', () => {

    //Reset
    currentAddr = null;
    tokenSAS = null;
    masterChef = null;
    web3 = null;
    tempWeb3 = null;

    mainContractInfo();
    if(localStorage.getItem("logout") != "true"){
        Connect();
    }
})



async function mainContractInfo() {
    if (NETID == 42161) {
        web3 = new Web3('https://arb1.croswap.com/rpc');
    } else {
        web3 = new Web3('https://arb1.arbitrum.io/rpc');
    }
    tokenSAS = await new web3.eth.Contract(ABI_TOKEN, ADDRESS_SAS);
    masterChef = await new web3.eth.Contract(ABI_MASTERCHEF_SINGLE, ADDRESS_MASTERCHEF_SINGLE);


    update();
}

async function Connect() {
    if (window.ethereum) {
        tempWeb3 = new Web3(window.ethereum)
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
            let accounts = await window.ethereum.request({ method: 'eth_accounts' })
            currentAddr = accounts[0]
            window.ethereum.on('chainChanged', (chainId) => {
                window.location.reload();
            });
            window.ethereum.on('accountsChanged', function(accounts) {
                window.location.reload();
            })
            runAPP()
            return
        } catch (error) {
            console.error(error)
        }
    }
}


async function runAPP() {
    networkID = await tempWeb3.eth.net.getId()
    if (networkID == NETID) {

        web3 = tempWeb3;
        tokenSAS = await new web3.eth.Contract(ABI_TOKEN, ADDRESS_SAS);
        masterChef = await new web3.eth.Contract(ABI_MASTERCHEF_SINGLE, ADDRESS_MASTERCHEF_SINGLE);

        getCurrentWallet();
        localStorage.setItem("logout", "false");



        //singlefarm30
        $("#singlefarm30-connect").css("display", "none");
        $("#singlefarm30-enable").css("display", "block");
        $("#singlefarm30-staking").css("display", "none");

        //singlefarm15
        $("#singlefarm15-connect").css("display", "none");
        $("#singlefarm15-enable").css("display", "block");
        $("#singlefarm15-staking").css("display", "none");

        //singlefarm60
        $("#singlefarm60-connect").css("display", "none");
        $("#singlefarm60-enable").css("display", "block");
        $("#singlefarm60-staking").css("display", "none");

        update();
    } else {
        $("#btn-connect-txt").text("Wrong network!");

        if (window.ethereum) {
            const data = [{
                chainId: '0xa4b1', //Mainnet
                //chainId: '0x61', //Testnet
                chainName: 'Arbitrum One',
                nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18
                },
                rpcUrls: ['https://arb1.croswap.com/rpc'], //https://data-seed-prebsc-1-s1.binance.org:8545 testnet //https://bsc-dataseed.binance.org/
                blockExplorerUrls: ['https://arbiscan.io/'],
            }]
            /* eslint-disable */
            const tx = await window.ethereum.request({ method: 'wallet_addEthereumChain', params: data }).catch()
            if (tx) {
                console.log(tx)
            }
        }
    }
}

$("#btn-disconnect").click(() => {
    localStorage.setItem("logout", "true");
    //Reset
    currentAddr = null;
    tokenSAS = null;
    masterChef = null;
    web3 = null;
    tempWeb3 = null;

    $("#btn-connect").text("Connect Wallet");
    $("#btn-connect").prop("disabled", false);
    $("#btn-disconnect").css("display", "none");

    //singlefarm30
    $("#singlefarm30-connect").css("display", "block");
    $("#singlefarm30-enable").css("display", "none");
    $("#singlefarm30-staking").css("display", "none");

    //singlefarm15
    $("#singlefarm15-connect").css("display", "block");
    $("#singlefarm15-enable").css("display", "none");
    $("#singlefarm15-staking").css("display", "none");

    //singlefarm60
    $("#singlefarm60-connect").css("display", "block");
    $("#singlefarm60-enable").css("display", "none");
    $("#singlefarm60-staking").css("display", "none");

    $("#singlefarm15-earn").text("0.0");
    $("#singlefarm30-earn").text("0.0");
    $("#singlefarm60-earn").text("0.0");
})

$("#btn-connect-metamask").click(() => {
    if (window.ethereum) {
        Connect();
    } else {
        alert("Please install Metamask first");
    }
})

$("#btn-connect-trust").click(() => {
    if (window.ethereum) {
        Connect();
    } else {
        alert("Please install Trust wallet and open the website on Trust/DApps");
    }
})


$("#btn-connect-wlconnect").click(async() => {
    var WalletConnectProvider = window.WalletConnectProvider.default;
    var walletConnectProvider = new WalletConnectProvider({
        rpc: {
            42161: 'https://arb1.croswap.com/rpc'
        },
        chainId: 42161,
        network: 'arbitrium',
    });
    await walletConnectProvider.enable();

    tempWeb3 = new Web3(walletConnectProvider);
    var accounts = await tempWeb3.eth.getAccounts();
    currentAddr = accounts[0];
    var connectedAddr = currentAddr[0] + currentAddr[1] + currentAddr[2] + currentAddr[3] + currentAddr[4] + currentAddr[5] + '...' + currentAddr[currentAddr.length - 6] + currentAddr[currentAddr.length - 5] + currentAddr[currentAddr.length - 4] + currentAddr[currentAddr.length - 3] + currentAddr[currentAddr.length - 2] + currentAddr[currentAddr.length - 1]
    $("#btn-connect").text(connectedAddr)
    $("#btn-connect").prop("disabled", true);
    $("#btn-disconnect").css("display", "flex");

    walletConnectProvider.on("chainChanged", (chainId) => {
        window.location.reload();
    });
    walletConnectProvider.on("disconnect", (code, reason) => {
        console.log(code, reason);
        window.location.reload();
    });

    runAPP()
})

async function getCurrentWallet() {
    if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
            currentAddr = accounts[0]
            var connectedAddr = currentAddr[0] + currentAddr[1] + currentAddr[2] + currentAddr[3] + currentAddr[4] + currentAddr[5] + '...' + currentAddr[currentAddr.length - 6] + currentAddr[currentAddr.length - 5] + currentAddr[currentAddr.length - 4] + currentAddr[currentAddr.length - 3] + currentAddr[currentAddr.length - 2] + currentAddr[currentAddr.length - 1]
            $("#btn-connect").text(connectedAddr);
            $("#btn-connect").prop("disabled", true);
            $("#btn-disconnect").css("display", "flex");

        }
    }
}


function update() {
    console.log("Update");
    updateParameters();
}
setInterval(update, 5000);


var yourLpBalance = 0;

var yourTokenInFarm15 = 0;
var rewardPerBlockFarm15 = 0;
var totalTokenInFarm15 = 0;

var yourTokenInFarm30 = 0;
var rewardPerBlockFarm30 = 0;
var totalTokenInFarm30 = 0;

var yourTokenInFarm60 = 0;
var rewardPerBlockFarm60 = 0;
var totalTokenInFarm60 = 0;

var amountSASPerLP = 0;

async function updateParameters() {
    if (tokenSAS) {
        if (currentAddr != null && currentAddr != undefined && currentAddr != "") {
            tokenSAS.methods.balanceOf(currentAddr).call().then(res => {
                yourLpBalance = (res / 1e18);
                var your_balance = (res / 1e18).toFixed(0);
                $("#singlefarm15-balance").text("Balance: " + your_balance + " SAS");
                $("#singlefarm30-balance").text("Balance: " + your_balance + " SAS");
                $("#singlefarm60-balance").text("Balance: " + your_balance + " SAS");
            })
            tokenSAS.methods.allowance(currentAddr, ADDRESS_MASTERCHEF_SINGLE).call().then(res => {
                if ((res / 1e18) < 1000000000) {
                    $("#singlefarm15-connect").css("display", "none");
                    $("#singlefarm15-enable").css("display", "block");
                    $("#singlefarm15-staking").css("display", "none");

                    $("#singlefarm30-connect").css("display", "none");
                    $("#singlefarm30-enable").css("display", "block");
                    $("#singlefarm30-staking").css("display", "none");

                    $("#singlefarm60-connect").css("display", "none");
                    $("#singlefarm60-enable").css("display", "block");
                    $("#singlefarm60-staking").css("display", "none");
                } else {
                    $("#singlefarm15-connect").css("display", "none");
                    $("#singlefarm15-enable").css("display", "none");
                    $("#singlefarm15-staking").css("display", "block");

                    $("#singlefarm30-connect").css("display", "none");
                    $("#singlefarm30-enable").css("display", "none");
                    $("#singlefarm30-staking").css("display", "block");

                    $("#singlefarm60-connect").css("display", "none");
                    $("#singlefarm60-enable").css("display", "none");
                    $("#singlefarm60-staking").css("display", "block");
                }
            })
        }
    }

    if (masterChef) {
        

            masterChef.methods.poolInfo(0).call().then(res => {
                // Calculate total in USD in this pool
                totalTokenInFarm15 = (res.totalDeposit / 1e18) * priceSAS;
                $("#singlefarm15-total").text(totalTokenInFarm15.toFixed(5) + " USD");
                $("#singlefarm15-api").text(res.poolApr/100 + "%");
                //apyFarm15();
            })

            masterChef.methods.poolInfo(1).call().then(res => {
                // Calculate total in USD in this pool
                totalTokenInFarm30 = (res.totalDeposit / 1e18) * priceSAS;
                $("#singlefarm30-total").text(totalTokenInFarm30.toFixed(5) + " USD");
                $("#singlefarm30-api").text(res.poolApr/100 + "%");
                //$("#singlefarm30-api").text(res.apy.toFixed(0) + "%");
                    //apyFarm30();
            })

            masterChef.methods.poolInfo(2).call().then(res => {
                // Calculate total in USD in this pool
                totalTokenInFarm60 = (res.totalDeposit / 1e18) * priceSAS;
                $("#singlefarm60-total").text(totalTokenInFarm60.toFixed(5) + " USD");
                $("#singlefarm60-api").text(res.poolApr/100 + "%");
                //$("#singlefarm60-api").text(res.apy.toFixed(0) + "%");
                //apyFarm60();
            })

        if (currentAddr != null && currentAddr != undefined && currentAddr != "") {

            // id = 0 - 15 days ----------------------------------/
            masterChef.methods.pendingReward(0, currentAddr).call().then(res => {
                $("#singlefarm15-earn").text((res / 1e18).toFixed(0));
                if ((res / 1e18).toFixed(0) > 0) {
                    $("#singlefarm15-collect").addClass("enable");
                }
            });
            masterChef.methods.userInfo(0, currentAddr).call().then(res => {
                yourTokenInFarm15 = res.depositAmount / 1e18;
                $("#singlefarm15-staked").text((res.depositAmount / 1e18).toFixed(0));
                $("#singlefarm15-staked1").text((res.depositAmount / 1e18).toFixed(0));

                var lastDeposit = res.lastDeposit;
                masterChef.methods.poolInfo(0).call().then(r => {
                    $("#singlefarm15-locking-time").text((r.withdrawLockPeriod / 86400).toFixed(0) + " days");
                    if(lastDeposit == 0){
                        $("#singlefarm15-unstake-warning").css("display", "none");
                    }else{
                        var unlockTimeStamp = parseFloat(lastDeposit) + parseFloat(r.withdrawLockPeriod);
                        if(Date.now()/1000 >= unlockTimeStamp){
                            $("#singlefarm15-unstake-warning").css("display", "none");
                        }else {
                            var unlockDate = new Date(unlockTimeStamp * 1000);
                            var hour = unlockDate.getHours();
                            var min = unlockDate.getMinutes();
                            var date = unlockDate.getDate();
                            var month = unlockDate.getMonth() + 1;
                            var year = unlockDate.getFullYear();
                            $("#singlefarm15-unstake-date").text(date + "/" + month + "/" + year + " - " + hour + ":" + min);
                            $("#singlefarm15-unstake-warning").css("display", "block");
                        }
                    }
                })
            })

            //id = 1 - 30 days ----------------------------------/
            masterChef.methods.pendingReward(1, currentAddr).call().then(res => {
                $("#singlefarm30-earn").text((res / 1e18).toFixed(0));
                if ((res / 1e18).toFixed(0) > 0) {
                    $("#singlefarm30-collect").addClass("enable");
                }
            });
            masterChef.methods.userInfo(1, currentAddr).call().then(res => {
                yourTokenInFarm30 = res.depositAmount / 1e18;
                $("#singlefarm30-staked").text((res.depositAmount / 1e18).toFixed(0));
                $("#singlefarm30-staked1").text((res.depositAmount / 1e18).toFixed(0));

                var lastDeposit = res.lastDeposit;
                masterChef.methods.poolInfo(1).call().then(r => {
                    $("#singlefarm30-locking-time").text((r.withdrawLockPeriod / 86400).toFixed(0) + " days");
                    if(lastDeposit == 0){
                        $("#singlefarm30-unstake-warning").css("display", "none");
                    }else{
                        var unlockTimeStamp = parseFloat(lastDeposit) + parseFloat(r.withdrawLockPeriod);
                        if(Date.now()/1000 >= unlockTimeStamp){
                            $("#singlefarm30-unstake-warning").css("display", "none");
                        }else {
                            var unlockDate = new Date(unlockTimeStamp * 1000);
                            var hour = unlockDate.getHours();
                            var min = unlockDate.getMinutes();
                            var date = unlockDate.getDate();
                            var month = unlockDate.getMonth() + 1;
                            var year = unlockDate.getFullYear();
                            $("#singlefarm30-unstake-date").text(date + "/" + month + "/" + year + " - " + hour + ":" + min);
                            $("#singlefarm30-unstake-warning").css("display", "block");
                        }
                    }
                })
            })

            //id = 2 - 60 days ----------------------------------/
            masterChef.methods.pendingReward(2, currentAddr).call().then(res => {
                $("#singlefarm60-earn").text((res / 1e18).toFixed(0));
                if ((res / 1e18).toFixed(0) > 0) {
                    $("#singlefarm60-collect").addClass("enable");
                }
            });
            masterChef.methods.userInfo(2, currentAddr).call().then(res => {
                yourTokenInFarm60 = res.depositAmount / 1e18;
                $("#singlefarm60-staked").text((res.depositAmount / 1e18).toFixed(0));
                $("#singlefarm60-staked1").text((res.depositAmount / 1e18).toFixed(0));

                var lastDeposit = res.lastDeposit;
                masterChef.methods.poolInfo(2).call().then(r => {
                    $("#singlefarm60-locking-time").text((r.withdrawLockPeriod / 86400).toFixed(0) + " days");
                    if(lastDeposit == 0){
                        $("#singlefarm60-unstake-warning").css("display", "none");
                    }else{
                        var unlockTimeStamp = parseFloat(lastDeposit) + parseFloat(r.withdrawLockPeriod);
                        if(Date.now()/1000 >= unlockTimeStamp){
                            $("#singlefarm60-unstake-warning").css("display", "none");
                        }else {
                            var unlockDate = new Date(unlockTimeStamp * 1000);
                            var hour = unlockDate.getHours();
                            var min = unlockDate.getMinutes();
                            var date = unlockDate.getDate();
                            var month = unlockDate.getMonth() + 1;
                            var year = unlockDate.getFullYear();
                            $("#singlefarm60-unstake-date").text(date + "/" + month + "/" + year + " - " + hour + ":" + min);
                            $("#singlefarm60-unstake-warning").css("display", "block");
                        }
                    }
                })
            })
        }else{
            masterChef.methods.poolInfo(2).call().then(r => {
                $("#singlefarm60-locking-time").text((r.withdrawLockPeriod / 86400).toFixed(0) + " days");
            });

            masterChef.methods.poolInfo(1).call().then(r => {
                $("#singlefarm30-locking-time").text((r.withdrawLockPeriod / 86400).toFixed(0) + " days");
            });

            masterChef.methods.poolInfo(0).call().then(r => {
                $("#singlefarm15-locking-time").text((r.withdrawLockPeriod / 86400).toFixed(0) + " days");
            });
        }
    }

    var tlv = totalTokenInFarm15 + totalTokenInFarm30 + totalTokenInFarm60;
    $("#tvl").text("$ " + tlv.toFixed(9));
}
// 5 %
function apyFarm15() {
    console.log("apyFarm15:" + totalTokenInFarm15 + "-" + rewardPerBlockFarm15)
    if (totalTokenInFarm15 > 0 && rewardPerBlockFarm15 > 0) {
        var apy =  100 * (priceSAS * rewardPerBlockFarm15 * 365 * 24 * 60 * 60 / 3) / totalTokenInFarm15;
        //var apy = totalTokenInFarm15 * 0.05;
        //var fifteendayRewards = (apy / 15);
        $("#singlefarm15-api").text(fifteendayRewards.toFixed(0) + "%");
    }
}
// 15%
function apyFarm30() {
    console.log("apyFarm30:" + totalTokenInFarm30 + "-" + rewardPerBlockFarm30)
    if (totalTokenInFarm30 > 0 && rewardPerBlockFarm30 > 0) {
        var apy =  100 * (priceSAS * rewardPerBlockFarm30 * 365 * 24 * 60 * 60 / 3) / totalTokenInFarm30;
        $("#singlefarm30-api").text(apy.toFixed(0) + "%");
    }
}
// 25%
function apyFarm60() {
    console.log("apyFarm60:" + totalTokenInFarm60 + "-" + rewardPerBlockFarm60)
    if (totalTokenInFarm60 > 0 && rewardPerBlockFarm60 > 0) {
        var apy =  100 * (priceSAS * rewardPerBlockFarm60 * 365 * 24 * 60 * 60 / 3) / totalTokenInFarm60;
        $("#singlefarm60-api").text(apy.toFixed(0) + "%");
    }
}

/********* 15days ACTION *******/
$("#singlefarm15-btn-enable").click(() => {
    try {
        if (tokenSAS && currentAddr != null && currentAddr != undefined && currentAddr != "") {
            tokenSAS.methods.approve(ADDRESS_MASTERCHEF_SINGLE, "1000000000000000000000000000000000").send({
                value: 0,
                from: currentAddr,
            })
        }
    } catch (error) {}
})

$("#singlefarm15-collect").click(() => {
    try {
        if (masterChef && currentAddr != null && currentAddr != undefined && currentAddr != "") {
            masterChef.methods.harvest(0).send({
                value: 0,
                from: currentAddr,
            })
        }
    } catch (error) {}
})

$("#singlefarm15-staking-confirm").click(() => {
    try {
        if (masterChef && currentAddr != null && currentAddr != undefined && currentAddr != "") {
            var amount = $("#singlefarm15-input-stake").val();
            //var tokens = amount * 10**9;
            //var tokens = web3.utils.toWei(amount, 'nano');
            var tokens = web3.utils.toBN(amount * 1e18);
            masterChef.methods.deposit(0, tokens).send({
                value: 0,
                from: currentAddr,
            })
        }
    } catch (error) {}
    clearSingleFarm15Input();
})

$("#singlefarm15-unstaking-confirm").click(() => {
    try {
        if (masterChef && currentAddr != null && currentAddr != undefined && currentAddr != "") {
            masterChef.methods.withdraw(0).send({
                value: 0,
                from: currentAddr,
            })
        }
    } catch (error) {};
    clearSingleFarm15Input();
})

$("#singlefarm15-unstake-max").click(() => {
    $('#singlefarm15-input-unstake').val(yourTokenInFarm15);
});

function clearSingleFarm15Input() {
    $('#singlefarm15-input-stake').val(0);
    $('#singlefarm15-input-unstake').val(0);
}

$("#singlefarm15-stake-max").click(() => {
    $('#singlefarm15-input-stake').val(yourLpBalance.toFixed(9) - 0.000000001); // - 0.000000001
});

/********* 30days ACTION *******/
$("#singlefarm30-btn-enable").click(() => {
    try {
        if (tokenSAS && currentAddr != null && currentAddr != undefined && currentAddr != "") {
            tokenSAS.methods.approve(ADDRESS_MASTERCHEF_SINGLE, "1000000000000000000000000000000000").send({
                value: 0,
                from: currentAddr,
            })
        }
    } catch (error) {}
})

$("#singlefarm30-collect").click(() => {
    try {
        if (masterChef && currentAddr != null && currentAddr != undefined && currentAddr != "") {
            masterChef.methods.harvest(1).send({
                value: 0,
                from: currentAddr,
            })
        }
    } catch (error) {}
})

$("#singlefarm30-staking-confirm").click(() => {
    try {
        if (masterChef && currentAddr != null && currentAddr != undefined && currentAddr != "") {
            var amount = $("#singlefarm30-input-stake").val();
            //var tokens = amount * 10**9;
            //var tokens = web3.utils.toWei(amount, 'nano');
            var tokens = web3.utils.toBN(amount * 1e18);
            masterChef.methods.deposit(1, tokens).send({
                value: 0,
                from: currentAddr,
            })
        }
    } catch (error) {}
    clearSingleFarm30Input();
})

$("#singlefarm30-unstaking-confirm").click(() => {
    try {
        if (masterChef && currentAddr != null && currentAddr != undefined && currentAddr != "") {
            masterChef.methods.withdraw(1).send({
                value: 0,
                from: currentAddr,
            })
        }
    } catch (error) {};
    clearSingleFarm30Input();
})

$("#singlefarm30-unstake-max").click(() => {
    $('#singlefarm30-input-unstake').val(yourTokenInFarm30);
});

function clearSingleFarm30Input() {
    $('#singlefarm30-input-stake').val(0);
    $('#singlefarm30-input-unstake').val(0);
}

$("#singlefarm30-stake-max").click(() => {
    $('#singlefarm30-input-stake').val(yourLpBalance.toFixed(9) - 0.000000001);
});

/********* 60days ACTION *******/
$("#singlefarm60-btn-enable").click(() => {
    try {
        if (tokenSAS && currentAddr != null && currentAddr != undefined && currentAddr != "") {
            tokenSAS.methods.approve(ADDRESS_MASTERCHEF_SINGLE, "1000000000000000000000000000000000").send({
                value: 0,
                from: currentAddr,
            })
        }
    } catch (error) {}
})

$("#singlefarm60-collect").click(() => {
    try {
        if (masterChef && currentAddr != null && currentAddr != undefined && currentAddr != "") {
            masterChef.methods.harvest(2).send({
                value: 0,
                from: currentAddr,
            })
        }
    } catch (error) {}
})

$("#singlefarm60-staking-confirm").click(() => {
    try {
        if (masterChef && currentAddr != null && currentAddr != undefined && currentAddr != "") {
            var amount = $("#singlefarm60-input-stake").val();
            //var tokens = amount * 10**9;
            //var tokens = web3.utils.toWei(amount, 'nano');
            var tokens = web3.utils.toBN(amount * 1e18);
            masterChef.methods.deposit(2, tokens).send({
                value: 0,
                from: currentAddr,
            })
        }
    } catch (error) {}
    clearSingleFarm60Input();
})

$("#singlefarm60-unstaking-confirm").click(() => {
    try {
        if (masterChef && currentAddr != null && currentAddr != undefined && currentAddr != "") {
            masterChef.methods.withdraw(2).send({
                value: 0,
                from: currentAddr,
            })
        }
    } catch (error) {};
    clearSingleFarm60Input();
})

$("#singlefarm60-unstake-max").click(() => {
    $('#singlefarm60-input-unstake').val(yourTokenInFarm60);
});

function clearSingleFarm60Input() {
    $('#singlefarm60-input-stake').val(0);
    $('#singlefarm60-input-unstake').val(0);
}

$("#singlefarm60-stake-max").click(() => {
    $('#singlefarm60-input-stake').val(yourLpBalance.toFixed(10) - 0.000000001);
});