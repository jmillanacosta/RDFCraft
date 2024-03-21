import { PrefixModel } from '@/lib/models/PrefixModel';
import { Box, Grid, Typography } from '@mui/material';
import PrefixCard from '../PrefixCard';

type _PrefixTabProps = {
  active: boolean;
  prefixes: PrefixModel[];
  removePrefix: (id: string) => void;
};

const PrefixTab = ({ active, prefixes, removePrefix }: _PrefixTabProps) => {
  return (
    <Box
      width='100%'
      display='flex'
      flexDirection='column'
      alignItems='center'
      sx={{ display: active ? 'flex' : 'none' }}
    >
      {prefixes.length === 0 ? (
        <Typography variant='h6'>No prefixes added yet</Typography>
      ) : (
        <Grid container spacing={2} style={{ padding: 16 }}>
          {prefixes.map(prefix => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={prefix.id}>
              <PrefixCard
                prefix={prefix}
                removePrefix={_id => removePrefix(_id)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default PrefixTab;
