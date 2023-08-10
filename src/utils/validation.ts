import { z } from 'zod';

export const USERNAME_VALIDATOR = z
  .string()
  .min(5, 'Username must contain at least 5 characters')
  .max(32, 'Username must contain at most 32 characters')
  .regex(
    /^(?!.*\s)[a-z0-9_]+$/i,
    'Please use only lowercase letters (a-z), numbers (0-9), and underscores.'
  );
