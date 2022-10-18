const crypto = require("crypto");
const fs = require("fs");
const algorithm = "aes-256-cbc";

const decryptBody = (req, res) => {
//   const input = decriptInput(req.body.input);
  const secret = decryptSecret(req.body.secret);

//   console.log(input.toString("utf-8"));
  console.log(secret.toString("utf-8"));
};

const decryptSecret = (secret) => {
  const privateKey = fs.readFileSync("public/private.pem", {
    encoding: "utf-8",
  }); //ดึง privateKey จากไฟล์ private.pem//
  const buffer = Buffer.from(secret, "base64"); //Buffer privateKey จากไฟล์ private.pem//

  const decryptedSecret = crypto.privateDecrypt(
    //นำ req.body.secret มา decript ด้วย privateKey แล้วเก็บไว้ที่ตัวแปร decryptedData//
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(secret, "base64")
  ); //จะได้ secret เพื่อไปถอดรหัส req.body.input อีกทีนึงด้วย AES Algorithm//
  return decryptedSecret;
};

const decriptInput = (encriptInput) => {
  const iv = crypto.randomBytes(16);
  const key = crypto.randomBytes(32);

  let encryptedText = Buffer.from(encriptInput, "hex");
  let decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString("utf-8");
};

module.exports = decryptBody;
