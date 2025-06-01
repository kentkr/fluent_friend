
// set colors for select and menu components
export const selectAndMenuSx = {
  fontSize: '14px',
  bgcolor: 'var(--color-foreground)',
  borderColor: 'var(--color-background)',
  '&:hover': { 
    bgcolor: 'var(--color-cyan)',
  },
  '&.MuiSelect-root': {
    borderColor: 'var(--color-green)',
  },
}

export const labelSx = {
  color: 'var(--color-background)'
}

// for Select, set propers for Paper components
export const menuProps = {
  PaperProps: {
    sx: {
      '& .MuiMenuItem-root.Mui-selected': {
        backgroundColor: 'var(--color-green) !important', // Selected background
        color: 'var(--color-white)', // Selected text color
      },
      '& .MuiMenuItem-root.Mui-selected:hover': {
        backgroundColor: 'var(--color-green)', // Selected + hover
      },
    },
  },
}

// style for form 
export const formSx = {
  margin: '0 2px',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--color-background)', // Default border
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--color-background)', // Focused border
  },
}

export const dividerSx = {
  borderColor: 'gray', 
  margin: '0 4px', 
  height: '66%', 
  alignSelf: 'center' 
}
