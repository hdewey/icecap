/**
 * PrimaryButton
 * InverseButton
 */

export const Button = {
  baseStyle: {
    fontWeight: 'bold', 
    borderRadius: 'sm',
  },
  variants: {
    PrimaryButton: {
      bg: 'primary',
      color: 'white',
      boxShadow: 'var(--box-shadow)',
      _hover: {
        bg: 'primary',
        opacity: 0.6,
      },
    },
    InverseButton: {
      bg: 'secondary',
      color: 'primary',
      boxShadow: 'var(--box-shadow)',
      _hover: {
        bg: 'secondary',
        opacity: 0.6,
      },
    },
  },
};