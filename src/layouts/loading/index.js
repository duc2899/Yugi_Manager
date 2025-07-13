import { Box, CircularProgress } from '@mui/material';

export default function LoadingScreen() {
    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0)', // hoặc thử rgba(0,0,0,0.3)
                zIndex: 9999
            }}>
            <CircularProgress
                size={50}
                thickness={3}
                sx={{
                    color: 'primary.main',
                    '& .MuiCircularProgress-circle': {
                        strokeLinecap: 'round'
                    }
                }}
            />
        </Box>
    );
}
