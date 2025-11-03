
module.exports.generateToken = () => {
    const chars = '123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const len = chars.length;
    const out = Array.from({length: 20});
    const buf = new Uint32Array(20);
    crypto.getRandomValues(buf);
    for (let i = 0; i < 20; i++) {
        out[i] = chars[buf[i] % len];
    }
    return out.join('');
}

