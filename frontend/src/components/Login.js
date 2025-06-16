import { Box, Button, Dialog, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";

export default function Login() {
    // attributes
    const [showRegisterDialog, setShowRegisterDialog] = useState(false);
    const [registerData, setRegisterData] = useState({ email: '', password: '', retypedPassword: '' });
    const [loginData, setLoginData] = useState({email : '', password : ''});
    
    // validation error messages
    const [emailValidationError, setEmailValiadtionError] = useState('');
    const [passwordValidationError, setPasswordValidationError] = useState('');
    const [retypedPasswordValidationError, setRetypedPasswordValidationError] = useState('');
    const emailPattern = /^[a-zA-Z0-9]+([._+-]+[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(-+[a-z0-9]+)*\.[a-z]{2,}$/;

    // functions
    function handleRegister(e) {
        e.preventDefault();
        // validate data
        // email validatioon

        if (!(emailPattern.test(registerData.email))){
            setEmailValiadtionError('Invalid email format');

            return;
        }
        setEmailValiadtionError('');
            // check if email really exists

        // passwords validation
        const passwordValidationPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|:;"'<>,.?/~`-])[a-zA-Z0-9!@#$%^&*()_+={}\[\]|:;"'<>,.?/~`-]{8,32}$/;
        if (!passwordValidationPattern.test(registerData.password)){
            setPasswordValidationError('Password must have atleast 1 UPPERCASE, 1 lowercase, 1 digit, and 1 special character with length between 8-32');

            return;
        }
        setPasswordValidationError('');

        // check if passwords match
        if (registerData.password !== registerData.retypedPassword){
            // do not attempt registering
            
            // notify user about mismatch
            setRetypedPasswordValidationError('Password does not match');
            return;
        }

        // reset error messages 
        setRetypedPasswordValidationError('');
        setShowRegisterDialog(false);

        // proceeed with registering

    }
    
    function handleLogin(e) {
        e.preventDefault();

        // validate email
        if (!(emailPattern.test(loginData.email))){
            setEmailValiadtionError('Invalid email format');

            return;
        }

        // check if account exists

        // check if password matches

        // login
    }

    return (
        <div>
            {/* Login Form */}
            <div id="login-form">
                {/* Validate form */}
                <form onSubmit={handleLogin}>
                    <label>Email : </label><input required type="text" /><br />
                    <label>Password : </label><input required type="password" /><br />
                    <input type="submit" value="Login" />
                    <button type="button" onClick={() => setShowRegisterDialog(true)}>Register</button>
                </form>
            </div>

            {/* Registration form */}
            <Dialog open={showRegisterDialog} onClose={() => setShowRegisterDialog(false)}>
                <DialogTitle>Register Account</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleRegister} sx={{ mt: 1 }}>
                        <TextField required fullWidth label="Email" type="email" margin="normal" error={!!emailValidationError} helperText={emailValidationError} value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}></TextField>
                        <TextField required fullWidth label="Password" type="password" margin="normal" error={!!passwordValidationError} helperText={passwordValidationError} value={registerData.password} onChange={(e) => setRegisterData({...registerData, password : e.target.value})}></TextField>
                        <TextField required fullWidth label="Re-type Password" type="password" margin="normal" error={!!retypedPasswordValidationError} helperText={retypedPasswordValidationError} value={registerData.retypedPassword} onChange={(e) => setRegisterData({...registerData, retypedPassword : e.target.value})}></TextField>
                        <Box sx={{mt:2, display: "flex", gap:1}}>
                            <Button type="submit" variant="contained">Register</Button>
                            <Button onClick={() => setShowRegisterDialog(false)}>Cancel</Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </div>
    );
}