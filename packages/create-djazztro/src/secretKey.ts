// Creates an *insecure* django secret key for use in development.

const CHARS = "abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(-_=+)".split("");
const KEY_LENGTH = 50;

export function getSecretKey() {
    const key = [];
    for (let i = 0; i < KEY_LENGTH; i++) {
        key.push(CHARS[Math.floor(Math.random() * CHARS.length)]);
    }
    return key.join("");
}
