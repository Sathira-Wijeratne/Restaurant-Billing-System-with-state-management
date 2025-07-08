import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const loginUser = createAsyncThunk(
    'auth/loginUser', 
    // the second argument is an async function that takes an object with email and password, and a thunkAPI object with rejectWithValue // what is thunkAPI object
    async({email, password}, {rejectWithValue}) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
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
                return rejectWithValue(error.message); // rejectWithValue() creates a rejected promise with a custom payload. It lets you return a specific error message that Redux can handle in the rejected case of your slice.
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
        const response = await fetch(`${API_URL}/api/verify-token`, {
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
const authSlice = createSlice({ //createSlice is Redux Toolkit's function that generates action creators and reducers automatically // authSlice is your authentication state manager containing login/logout logic.
    // set the name property to 'auth'
    name: 'auth',
    // set the initialState property with user, isAuthenticated, loading, and error properties 
    initialState: { // initialState is the starting values for your Redux state before any actions are dispatched.
        user : null,
        isAuthenticated : false,
        loading : true,
        error: null
    },
    // set the reducers property as an object
    reducers: { // reducers are Functions that specify how state changes in response to actions. They take current state and return new state.
        // define a logout reducer function that takes state as an argument // reducer functions are Pure functions that handle specific actions - they receive state and action, then return updated state.
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        }
    },
    // set the extraReducers property as a function that takes a builder object 
    // builder is Redux Toolkit's utility for handling async thunk actions.  
    // extraReducers handle actions created outside the slice (like async thunks).
    extraReducers: (builder) => {
        // how does this parameter have access to addCase method? does anything passed as a parameter have access to this method? - Redux Toolkit passes a pre-configured builder object with methods like addCase. Only this specific builder object has these methods.
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

export const {logout} = authSlice.actions; // extracts the logout action creator so other components can dispatch logout actions.
// export the authSlice reducer as the default export
export default authSlice.reducer;