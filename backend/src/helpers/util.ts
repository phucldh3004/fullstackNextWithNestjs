import * as bcrypt from 'bcrypt';
// const saltRounds = 10;

export const hasPasswordHelper = async (password: string) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    console.error(error, 'Failed to hash password');
    throw new Error('Failed to hash password');
  }
};

export const comparePasswordHelper = async (
  plainPassword: string,
  hash: string,
) => {
  console.log(plainPassword, hash, 'plainPassword, hash');
  try {
    console.log(await bcrypt.compare(plainPassword, hash), 'compare');
    return await bcrypt.compare(plainPassword, hash);
  } catch (error) {
    console.error(error, 'Failed to compare password');
    throw new Error('Failed to compare password');
  }
};
