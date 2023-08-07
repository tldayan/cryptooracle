

export const getCoins = async(page) => {

    try {

        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=${page}&sparkline=false&locale=en`,
        {method : "GET",
        headers : {
            accept : "application/json"
        }})

        if(!response.ok) {
            throw new Error (`Could not fetch cryptocurrencies: ${response.status}`)
        }

        const Coins = response.json()
        return Coins 

    } catch(error) {
        return {error : true, message : error.message }
    }
}
