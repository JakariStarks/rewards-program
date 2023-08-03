import React, {useState, useEffect} from "react";
import fetch from './dataservice';


function App() {
    const [customerData, setCustomerData] = useState(null);
    useEffect(() => {
        fetch().then((customerData) => {
            let data = configureData(customerData);
            setCustomerData(data);
        });
    }, []);

    if (!customerData) {
        return <h1>LOADING</h1>;
    } else {
        console.log(customerData);
    }
}

function rewardsEarnedPerTransaction(transactionTotal) {
    let rewards = 0;
    if (transactionTotal > 50 && transactionTotal < 101) {
        rewards = transactionTotal - 50;
    } else if (transactionTotal > 100) {
        rewards = 2 * (transactionTotal - 100) + 50;
    } else {
        rewards = 0;
    }
    return rewards;
}

function configureData(customerData) {
    let rewardsEarnedEachTrans = customerData.map(customerTransaction => {
        const monthOfTrans = new Date(customerTransaction.transactionDate).getMonth();
        let rewards = rewardsEarnedPerTransaction(customerTransaction.transactionAmount);
        return {...customerTransaction, rewards, monthOfTrans};
    });

    const customer = {};
    const customerRewardsTotal = {};

    rewardsEarnedEachTrans.forEach(rewardsEarnedEachTrans => {
        let {customerID, customerName, monthOfTrans, rewards} = rewardsEarnedEachTrans;

        if (!customer[customerID]) {
            customer[customerID] = [];
        }

        if (!customerRewardsTotal[customerID]) {
            customerRewardsTotal[customerID] = 0;
        }

        customerRewardsTotal[customerID] += rewards;

        if (!(customer[customerID][monthOfTrans])) {
            customer[customerID][monthOfTrans] = {

                customerID,
                customerName,
                rewards,
                monthOfTrans,

            }
        }
    });

    return {
        function: configureCustomerSummary(customer, customerRewardsTotal), rewardsEarnedEachTrans
    };
}

function configureCustomerSummary(customer, customerRewardsTotal) {
    let monthlySummary = [];

    for (let x in customer) {
        customer[x].forEach(p => {
            p.customerRewardsTotal = customerRewardsTotal[x];
            monthlySummary.push(p);
        });
    }

    return monthlySummary;
}

export default App;