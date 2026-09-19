// components/EnvSwitch/index.js
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CheckIcon from '@mui/icons-material/Check';
import { getDataEnv, setDataEnv } from '../../utils'; 

const ENV_CONFIG = {
    dev: { label: 'dev', color: '#2196f3' },
    live: { label: 'live', color: '#f44336' }
};

function EnvSwitch() {
    const [openMenu, setOpenMenu] = useState(null);
    const [env, setEnv] = useState(getDataEnv());

    const handleOpenMenu = (event) => {
        setOpenMenu(event.currentTarget);
    };
    const handleCloseMenu = () => setOpenMenu(null);

    const handleSelectEnv = (key) => {
        if (key === env) {
            handleCloseMenu();
            return;
        }

        if (key === 'live') {
            const confirmed = window.confirm(
                'Bạn sắp chuyển sang môi trường LIVE (dữ liệu thật). Tiếp tục?'
            );
            if (!confirmed) {
                handleCloseMenu();
                return;
            }
        }

        setDataEnv(key);
        setEnv(key);
        handleCloseMenu();
        window.location.reload(); // đảm bảo data/query fetch lại đúng env mới
    };

    const current = ENV_CONFIG[env];

    return (
        <>
            <IconButton
                size="large"
                disableRipple
                color="inherit"
                onClick={handleOpenMenu}
            >
                <FiberManualRecordIcon sx={{ color: current.color, fontSize: '1rem' }} />
            </IconButton>

            <Menu
                anchorEl={openMenu}
                anchorReference={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
                open={Boolean(openMenu)}
                onClose={handleCloseMenu}
                sx={{ mt: 2 }}
            >
                {Object.entries(ENV_CONFIG).map(([key, value]) => (
                    <MenuItem
                        key={key}
                        selected={key === env}
                        onClick={() => handleSelectEnv(key)}
                    >
                        <ListItemIcon>
                            <FiberManualRecordIcon sx={{ color: value.color, fontSize: '0.5rem' }} />
                        </ListItemIcon>
                        <ListItemText primary={value.label} sx={{ fontSize: 12 }} />
                        {key === env && (
                            <ListItemIcon sx={{ minWidth: 'auto', ml: 1 }}>
                                <CheckIcon fontSize="small" />
                            </ListItemIcon>
                        )}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}

export default EnvSwitch;