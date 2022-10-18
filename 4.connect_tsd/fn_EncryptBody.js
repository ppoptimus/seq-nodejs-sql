const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const fs = require("fs");

const encryptBody = (req, res) => {
  let encryptedInput = encryptInput(JSON.stringify(req.body));
  let encryptedSecret = encryptSecret();
  let response = res.status(200).json({
    input: encryptedInput,
    secret: encryptedSecret,
  });
  return response;
};

const encryptInput = (plainText) => {
  const iv = crypto.randomBytes(16);
  const key = Buffer.from(secretKey(), "base64");

  let cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(plainText);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return encrypted.toString("base64");
};

const encryptSecret = () => {
  console.log("secret encrypted key = ", secretKey());
  const publicKey = fs.readFileSync("public/public.pem", { encoding: "utf-8" });

  const encryptedData = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },

    Buffer.from(secretKey())
  );
  return encryptedData.toString("base64", { encoding: "utf-8" });
};

const secretKey = () => {
  const key = crypto.randomBytes(32);
  return key.toString("base64");
};

module.exports = encryptBody;
