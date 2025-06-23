import { Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, TextField } from "@mui/material";
import { addDoc, collection, doc, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import cong from "../Firebase";
import bcrypt from "bcryptjs";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Login() {
    // attributes
    const [showRegisterDialog, setShowRegisterDialog] = useState(false);
    const [registerData, setRegisterData] = useState({ email: '', password: '', retypedPassword: '' });
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);

    // validation error messages
    const [signupEmailValidationError, setSignupEmailValiadtionError] = useState('');
    const [signupPasswordValidationError, setSignupPasswordValidationError] = useState('');
    const [signupRetypedPasswordValidationError, setRetypedPasswordValidationError] = useState('');

    const [loginEmailValidationError, setLoginEmailValidationError] = useState('');
    const [loginPasswordValidationError, setLoginPasswordValidationError] = useState('');
    // regex
    const emailPattern = /^[a-zA-Z0-9]+([._+-]+[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(-+[a-z0-9]+)*\.[a-z]{2,}$/;

    // toasts
    const notifyAccountCreationSuccess = () => toast.success("Account successfully created");
    const notifyAccountCreationFail = () => toast.error("Account not created");
    const notifyLoginFail = () => toast.error("Login failed");

    const navigate = useNavigate();

    // functions
    async function handleRegister(e) {
        e.preventDefault();
        // validate data
        // email validatioon

        if (!(emailPattern.test(registerData.email))) {
            setSignupEmailValiadtionError('Invalid email format');

            return;
        }
        setSignupEmailValiadtionError('');
        // check if email really exists

        // passwords validation
        const passwordValidationPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|:;"'<>,.?/~`-])[a-zA-Z0-9!@#$%^&*()_+={}\[\]|:;"'<>,.?/~`-]{8,32}$/;
        if (!passwordValidationPattern.test(registerData.password)) {
            setSignupPasswordValidationError('Password must have atleast 1 UPPERCASE, 1 lowercase, 1 digit, and 1 special character with length between 8-32');

            return;
        }
        setSignupPasswordValidationError('');

        // check if passwords match
        if (registerData.password !== registerData.retypedPassword) {
            // do not attempt registering

            // notify user about mismatch
            setRetypedPasswordValidationError('Password does not match');
            return;
        }

        // reset error messages 
        setRetypedPasswordValidationError('');

        // proceeed with registering
        try {
            // check if account already exists
            const usersRef = collection(cong, "users");
            const q = query(usersRef, where("email", "==", registerData.email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setSignupEmailValiadtionError('Account already exists');

                return;
            }

            setSignupEmailValiadtionError('');
            setIsLoading(true);

            // hash password
            const passwordHash = await bcrypt.hash(registerData.password, 10);

            const docRef = await addDoc(collection(cong, "users"), {
                email: registerData.email,
                password: passwordHash
            });

            // success toast
            setIsLoading(false);
            notifyAccountCreationSuccess();
            setShowRegisterDialog(false);
        } catch (error) {
            // unsuccess toast
            console.error("Account registration failed", error);
            notifyAccountCreationFail();
        }
    }

    async function handleLogin(e) {
        e.preventDefault();

        // validate email
        if (!(emailPattern.test(loginData.email))) {
            setLoginEmailValidationError('Invalid email format');

            return;
        }
        setLoginEmailValidationError('');

        // check if account exists
        try {
            setIsLoading(true);

            const response = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers : {
                    'Content-Type' : 'application/json', // tells the server that the data being sent in the request body is in JSON format.
                },
                body: JSON.stringify(loginData), //convert the JavaScript object into a JSON string
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Login successful', data);
                localStorage.setItem('accessToken', data.accessToken);
                setIsLoading(false);
                navigate('/items');
            } else {
                console.log(data.message);
                setIsLoading(false);

                if (data.message === 'Account not found'){
                    setLoginEmailValidationError(data.message);
                } else if (data.message === 'Incorrect password') {
                    setLoginPasswordValidationError(data.message);
                } else {
                    notifyLoginFail();
                }
            }
        } catch (error) {
            setIsLoading(false);
            console.error("Login request failed", error);
            notifyLoginFail();
        }
    }

    return (
        <Box>
            {/* Toast */}
            <ToastContainer
                position="bottom-center"
                autoClose={5000}
                pauseOnHover={false}
                hideProgressBar={true}
                closeButton={false}
                theme="light"
                style={{ width: 'auto' }}
            />
            {/* Login Form */}
            <Box sx={{ display: 'flex', alignItems: 'center', alignContent: 'center', justifyContent: "center" }} mt={5}>

                {/* Loading screen */}
                {isLoading &&
                    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: 2, zIndex: 1400 }}>
                        <CircularProgress></CircularProgress>
                    </Box>}

                <Box component="form" onSubmit={handleLogin} sx={{ display: "flex", gap: 1, flexDirection: "column", maxWidth: 400, width: '100%', backgroundColor: 'white', padding: 4, borderRadius: 2, boxShadow: 3, mx: 2, position: 'relative' }} mt={1}>
                    <h2 style={{ margin: 0 }}>Login</h2>

                    <TextField required fullWidth type="email" label="Email" error={!!loginEmailValidationError} helperText={loginEmailValidationError} onChange={(e) => { setLoginData({ ...loginData, email: e.target.value }) }}></TextField>
                    <TextField required fullWidth type="password" label="Password" error={!!loginPasswordValidationError} helperText={loginPasswordValidationError} onChange={(e) => { setLoginData({ ...loginData, password: e.target.value }) }}></TextField>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Button type="submit" variant="contained" sx={{ flex: 1, py: 1.5 }}>Login</Button>
                        <Button type="button" variant="contained" sx={{ flex: 1, py: 1.5 }} onClick={() => setShowRegisterDialog(true)}>Sign Up</Button>
                    </Box>
                </Box>
            </Box>


            {/* Registration form */}
            <Dialog open={showRegisterDialog} onClose={() => setShowRegisterDialog(false)}>
                <DialogTitle>Register Account</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleRegister} sx={{ mt: 1 }}>
                        <TextField required fullWidth label="Email" type="email" margin="normal" error={!!signupEmailValidationError} helperText={signupEmailValidationError} value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}></TextField>
                        <TextField required fullWidth label="Password" type="password" margin="normal" error={!!signupPasswordValidationError} helperText={signupPasswordValidationError} value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}></TextField>
                        <TextField required fullWidth label="Re-type Password" type="password" margin="normal" error={!!signupRetypedPasswordValidationError} helperText={signupRetypedPasswordValidationError} value={registerData.retypedPassword} onChange={(e) => setRegisterData({ ...registerData, retypedPassword: e.target.value })}></TextField>
                        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                            <Button type="submit" variant="contained">Register</Button>
                            <Button onClick={() => setShowRegisterDialog(false)}>Cancel</Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
}