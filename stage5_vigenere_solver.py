ciphertext = "OTRKL5_TFSK=Geirlz0R{oeneysbgy9_nmceeiys}|MLECE6_YSZH=mlece6|JXHUY6_HVKTFGVZ=MKL|OTRKL6_IMWVJADI=r0l_ihinaksy|GNSKA6_PRWZKIJH=Jeoe@2026!"
key = "WAREHOUSE"

def vigenere_decrypt(text, key):
    result = []
    j = 0
    for c in text:
        if c.isascii() and c.isalpha():
            shift = ord(key[j % len(key)].upper()) - ord("A")
            base = ord("A") if c.isupper() else ord("a")
            result.append(chr((ord(c) - base - shift) % 26 + base))
            j += 1
        else:
            result.append(c)
    return "".join(result)

print(vigenere_decrypt(ciphertext, key))
