import { Box, Button, Dialog, DialogContent, DialogTitle, TextField } from "@mui/material";
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

            // hash password
            const passwordHash = await bcrypt.hash(registerData.password, 10);

            const docRef = await addDoc(collection(cong, "users"), {
                email: registerData.email,
                password: passwordHash
            });

            // success toast
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
            const usersRef = collection(cong, "users");
            const q = query(usersRef, where("email", "==", loginData.email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setSignupEmailValiadtionError('Account not found');

                return;
            }

            setSignupEmailValiadtionError('');

            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();
            const isPasswordValid = await bcrypt.compare(loginData.password, userData.password);

            if (!isPasswordValid){
                setLoginPasswordValidationError('Incorrect Password');

                return;
            }

            setLoginPasswordValidationError('');

            // proceed to home page
            navigate('/items');

        } catch (error) {
            console.error("Login failed", error);
            notifyLoginFail();
        }

        // check if password matches


        // login

    }

    // helper methods
    async function isAccountExist(email) {
        try {
            const usersRef = collection(cong, "users");
            const q = query(usersRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);

            return !querySnapshot.empty;

        } catch (error) {
            console.error("Error checking account existence", error);
            return false;
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
                <Box component="form" onSubmit={handleLogin} sx={{ display: "flex", gap: 1, flexDirection: "column", maxWidth: 400, width: '100%', backgroundColor: 'white', padding: 4, borderRadius: 2, boxShadow: 3, mx: 2 }} mt={1}>
                    <h2 style={{ margin: 0 }}>Login</h2>

                    <TextField required fullWidth type="email" label="Email" error={!!loginEmailValidationError} helperText={loginEmailValidationError} onChange={(e) => {setLoginData({...loginData, email : e.target.value})}}></TextField>
                    <TextField required fullWidth type="password" label="Password" error={!!loginPasswordValidationError} helperText={loginPasswordValidationError} onChange={(e) => {setLoginData({...loginData, password : e.target.value})}}></TextField>
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