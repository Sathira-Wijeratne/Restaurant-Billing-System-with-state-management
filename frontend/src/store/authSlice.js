import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
    'auth/loginUser', 
    // the second argument is an async function that takes an object with email and password, and a thunkAPI object with rejectWithValue // what is thunkAPI object
    async({email, password}, {rejectWithValue}) => {
        try {
            const response = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers:{'Content-Type': 'application/json'},
                // set credentials to 'include' for cookies // what does this mean?
                credentials: 'include',                
                body: JSON.stringify({email, password})
            });

            console.log(response);


            if (!response.ok) {
                // if not ok, parse the error from the response body // what does parse the error mean?
                const error = await response.json();
                return rejectWithValue(error.message); // how does this method work                
            }

            return await response.json();
        } catch (error) {
            console.error('Login Failed', error);
            return rejectWithValue('Login failed');
        }
    }
);

export const verifyAuth = createAsyncThunk(
    'auth/verifyAuth',
    async (_, {rejectWithValue}) => {
     try {
        const response = await fetch('http://localhost:3001/api/verify-token', {
            credentials: 'include'
        });

        if (!response.ok) {
            return rejectWithValue('Not authenticated');
        }

        return await response.json();

     } catch (error) {
        return rejectWithValue('Verification failed', error);
     }   
    }
);

// create a slice using createSlice and assign it to a constant named authSlice
const authSlice = createSlice({ // what does createSlice and authSlice do?
    // set the name property to 'auth'
    name: 'auth',
    // set the initialState property with user, isAuthenticated, loading, and error properties // what is initialState?
    initialState: {
        user : null,
        isAuthenticated : false,
        loading : true,
        error: null
    },
    // set the reducers property as an object // what is reducer?
    reducers: {
        // define a logout reducer function that takes state as an argument // what is a reducer function?
        logout: (state) => {
            // inside the logout reducer, set state.user to null
            state.user = null;
            // set state.isAuthenticated to false
            state.isAuthenticated = false;
        }
    },
    // set the extraReducers property as a function that takes a builder object // what is a builder object? // what are extraReducers?
    extraReducers: (builder) => {
        // how does this parameter have access to addCase method? does anything passed as a parameter have access to this method?
        // use the builder to add a case for loginUser.fulfilled
        // the callback function takes state and action
        builder
        .addCase(loginUser.fulfilled, (state, action) => {
            // inside the callback, set state.user to action.payload.user
            state.user = action.payload.user;
            // set state.isAuthenticated to true
            state.isAuthenticated = true;
            // set state.loading to false
            state.loading = false;
        })
        .addCase(verifyAuth.pending, (state) => {
            state.loading = true;
        })
        .addCase(verifyAuth.fulfilled, (state, action) => {
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.loading = false;
        })
        .addCase(verifyAuth.rejected, (state) => {
            state.isAuthenticated = false;
            state.loading = false;
        })
    }
});

// export the logout action creator from authSlice.actions // what does this below export do?
export const {logout} = authSlice.actions;
// export the authSlice reducer as the default export
export default authSlice.reducer;