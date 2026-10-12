// scripts/hash-password.mjs
// Jalankan: node scripts/hash-password.mjs katasandi_anda
import bcrypt from 'bcryptjs';
const plain = process.argv[2];
if (!plain) {
  console.log('Pakai: node scripts/hash-password.mjs katasandi');
  process.exit(1);
}
bcrypt.hash(plain, 10).then((hash) => console.log(hash));