const bcrypt = require("bcryptjs");

const password = "NpQrTmX7*";
const hash = "$2a$10$uf6Rv9psoeuaSTu1laxvVervHsDPwztTX0EmtoUjTNES6YWSr.NTG";

bcrypt.compare(password, hash).then((result) => {
  console.log("Password verification result:", result);
  process.exit(0);
});
