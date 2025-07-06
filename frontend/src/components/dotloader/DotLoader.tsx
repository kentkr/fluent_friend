
import { Box } from '@mui/material';

export default function DotLoader({ color }: { color: string }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'end', 
        gap: 0.5,
        height: '24px', 
        overflow: 'hidden',
        paddingBottom: '2px' 
      }}
    >
      <Dot color={color} delay="0s" />
      <Dot color={color} delay="0.2s" />
      <Dot color={color} delay="0.4s" />
    </Box>
  );
}

function Dot({ delay, color }: { delay: string, color: string }) {
  return (
    <Box
      sx={{
        width: 5,
        height: 5,
        borderRadius: '50%',
        backgroundColor: color,
        animation: `bounceY 1.2s infinite ease-in-out`,
        animationDelay: delay,
        '@keyframes bounceY': {
          '0%, 80%, 100%': {
            transform: 'translateY(0)', // baseline
          },
          '40%': {
            transform: 'translateY(-8px)', // bounce up
          },
        },
      }}
    />
  );
}
