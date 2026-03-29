require('dotenv').config();
const { env } = require('@koncokirim-app/env/server');
console.log("URL:", env.EVOLUTION_API_URL);
console.log("Key:", env.EVOLUTION_API_KEY);
console.log("Instance:", env.EVOLUTION_INSTANCE_NAME);
