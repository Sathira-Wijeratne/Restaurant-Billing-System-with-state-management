import { Logout } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {useDispatch} from 'react-redux';
import {logoutUser} from '../store/authSlice';

export default function LogoutButton() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    function handleLogout(){
        // remove JWT
        dispatch(logoutUser());
        navigate('/');
    }

    return (
        <>
        {/* Logout Button */}
                <Box sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    zIndex: 1000
                }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleLogout()}
                        startIcon={<Logout />}
                        sx={{
                            borderRadius: 2,
                            px: 2,
                            py: 1,
                            boxShadow: (theme) => `0 4px 8px ${theme.palette.secondary.main}33`
                        }}
                    >
                        Logout
                    </Button>
                </Box>
        </>
    );
};