

export const getCoins = async(page) => {

    try {

        const response = await fetch(`https://cryptooracle-server.vercel.app/api/coins?page=${page}`,
        {method : "GET",
        headers : {
            accept : "application/json"
        }})

        if(!response.ok) {
            throw new Error (`Could not fetch cryptocurrencies: ${response.status}`)
        }

        const Coins = await response.json()
        return Coins 

    } catch(error) {
        return {error : true, message : error.message }
    }
}
