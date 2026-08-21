import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Breadcrumbs, Link, Typography, Box } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export default function AppBreadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <Box sx={{ mb: 3 }}>
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{
          '& .MuiBreadcrumbs-li': {
            fontSize: '0.95rem',
          }
        }}
      >
        <Link component={RouterLink} underline="hover" color="text.secondary" to="/">
          Beranda
        </Link>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          
          // Custom mapping for some routes if needed, otherwise capitalize
          const displayName = value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');

          return last ? (
            <Typography color="primary.main" key={to} fontWeight="700">
              {displayName}
            </Typography>
          ) : (
            <Link component={RouterLink} underline="hover" color="text.secondary" to={to} key={to}>
              {displayName}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
}
