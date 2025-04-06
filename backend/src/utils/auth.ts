import crypto from "crypto";

const comparePasswords = async ({
  password,
  salt,
  hashedPassword,
}: {
  password: string;
  salt: string;
  hashedPassword: string;
}): Promise<boolean> => {
  const inputHashedPassword = await hashPassword(password, salt);

  return crypto.timingSafeEqual(
    Buffer.from(inputHashedPassword, "hex"),
    Buffer.from(hashedPassword, "hex")
  );
};

const generateSalt = async (): Promise<string> =>
  crypto.randomBytes(16).toString("hex").normalize();

const hashPassword = async (password: string, salt: string): Promise<string> =>
  new Promise((resolve, reject) => {
    crypto.scrypt(password.normalize(), salt, 64, (error, hash) => {
      if (error) return reject(error);
      resolve(hash.toString("hex").normalize());
    });
  });

export { comparePasswords, generateSalt, hashPassword };
