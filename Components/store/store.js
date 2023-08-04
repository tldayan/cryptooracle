import {configureStore} from "@reduxjs/toolkit"

import watchlistSlice from "./Watchlist-Slice"

const store = configureStore({
    reducer : {
        watchlist : watchlistSlice.reducer
    }
})

export default store