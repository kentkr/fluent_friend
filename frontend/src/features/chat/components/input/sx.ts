
export const inputSx = {
  // Remove margin from root FormControl
  margin: 0,

  // Target the InputBase root
  '& .MuiInputBase-root': {
    margin: '4px',
    padding: '4px',
    border: 1
  },

  // Target the actual input/textarea element
  '& .MuiInputBase-input': {
    padding: 0,
    margin: 0,
  },

  // Target the fieldset (outline)
  '& .MuiOutlinedInput-notchedOutline': {
    padding: 0,
    margin: 0,
  },

  // Optional: Remove the outline border entirely if desired
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: 'none',
    },
    '&:hover fieldset': {
      border: 'none',
    },
    '&.Mui-focused fieldset': {
      border: 'none',
    },
  }
}
