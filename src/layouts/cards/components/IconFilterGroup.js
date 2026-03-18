// components/IconFilterGroup.jsx
import { Box, Tooltip } from '@mui/material';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';

function IconFilterGroup({
    title,
    data,
    selected,
    onSelect,
    icons
}) {
    return (
        <>
            <MDTypography variant="h6" sx={{ mb: '15px', fontWeight: 600, color: '#fff' }}>
                {title}
            </MDTypography>

            <Box sx={{ display: 'flex', gap: '8px', mb: '25px', flexWrap: 'wrap' }}>
                {data.length > 0 ? data.map(item => (
                    <Tooltip key={item.key} title={item.name} arrow>
                        <MDButton
                            onClick={() => onSelect(item.key)}
                            size="small"
                            sx={{
                                padding: '8px',
                                minWidth: '40px',
                                height: '40px',
                                backgroundColor: selected.includes(item.key)
                                    ? '#ffa500'
                                    : '#4a4a4a',
                                color: '#fff',
                                border: '1px solid #666',
                                '&:hover': { backgroundColor: '#5a5a5a' }
                            }}
                        >
                            {item.name === 'All' || !icons || !icons[item.key] ? (
                                item.name
                            ) : (
                                <img
                                    src={icons[item.key]}
                                    alt={item.name}
                                    style={{ width: 24, height: 24 }}
                                />
                            )}
                        </MDButton>
                    </Tooltip>
                )) : (
                    <MDTypography variant="body2" sx={{ color: '#aaa' }}>
                        No data available
                    </MDTypography>
                )}
            </Box>
        </>
    );
}

export default IconFilterGroup;
