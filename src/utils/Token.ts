import { randomBytes } from "crypto";

export const generateResetToken = () => {
  return randomBytes(32).toString("hex");
};

export function generateCode() {
  return Math.floor(100000 + Math.random() * 900000);
}

// console.log(generateCode());
