import { formatPassword } from '@lib/encryption';
import { ALLOW_REGEX } from '@utils/regex-patterns';
import { passwordValidation } from '@validation/common';
import { z } from 'zod';

export const AuthSchema = z.object({
  username: z.string('Username is Required').regex(ALLOW_REGEX.USERNAME, 'Invalid username').trim(),
  password: passwordValidation.transform((v) => formatPassword(v)),
});
