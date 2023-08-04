

import {createSlice} from "@reduxjs/toolkit"

const watchlistSlice = createSlice({
    name : "watchlist",
    initialState : {watchlist : []},
    reducers : {
        handleWatchlist(state, action) {
            const coin = action.payload
            if(state.watchlist.includes(action.payload)) {
                
                state.watchlist = state.watchlist.filter(eachCoin => eachCoin !== action.payload)
            
            } else {
                
                state.watchlist = [...state.watchlist, coin]
            }
        },
        removeFromWatchlist(state,action) {
            const coin = action.payload
            state.watchlist = state.watchlist.filter(eachCoin => eachCoin !== action.payload)
        }
    }
})

export const watchlistActions = watchlistSlice.actions

export default watchlistSlice