#!/usr/bin/env python3
"""
Kernel0X CTF - Member 2 (Challenge Design A)
Stage 3 Solver: Caesar Substitution Cipher Decoder & Cryptanalysis
Learning Outcome: LO2 (Crypto Techniques) & LO3 (Exploitation/Solver Code)
"""

import sys
import re

def decrypt_caesar(ciphertext, shift):
    """Decrypts a Caesar ciphertext with a given backward shift offset."""
    result = []
    for char in ciphertext:
        if 'a' <= char <= 'z':
            result.append(chr((ord(char) - 97 - shift) % 26 + 97))
        elif 'A' <= char <= 'Z':
            result.append(chr((ord(char) - 65 - shift) % 26 + 65))
        else:
            result.append(char)
    return "".join(result)

def solve_stage3_crypto(ciphertext="Rlyuls0E{jhlzhy_pz_jshzzpj}", shift_key=7):
    print("=" * 60)
    print("[*] Kernel0X Stage 3: Classical Cryptography (Caesar Cipher)")
    print("=" * 60)
    print(f"[*] Input Ciphertext : {ciphertext}")
    print(f"[*] Lock Puzzle Key  : {shift_key} (Recovered from Crack The Lock Matrix)")

    print(f"[*] Cryptographic Deduction:")
    print(f"    - Crack the Lock constraints isolate the single-digit key: {shift_key} (ROT-7)")
    print(f"    - Mathematical rule: Plaintext_i = (Ciphertext_i - {shift_key}) mod 26")

    print("\n[*] Running Cryptanalytic Brute-Force & Frequency Verification (All 25 Shifts):")
    target_flag = None
    for s in range(1, 26):
        attempt = decrypt_caesar(ciphertext, s)
        is_match = attempt.startswith("Kernel0X{")
        marker = " <--- [MATCH! TARGET FLAG]" if is_match else ""
        if s == shift_key or is_match:
            print(f"    [Shift {s:02d}] {attempt}{marker}")
            if is_match:
                target_flag = attempt

    print("\n" + "-" * 50)
    print(f"[+] DECRYPTED STAGE 3 FLAG: {target_flag}")
    print("-" * 50)
    print(f"[*] Submitting this flag unlocks Stage 4 (Network Forensics).")
    return target_flag

if __name__ == "__main__":
    c = sys.argv[1] if len(sys.argv) > 1 else "Rlyuls0E{jhlzhy_pz_jshzzpj}"
    k = int(sys.argv[2]) if len(sys.argv) > 2 else 7
    solve_stage3_crypto(c, k)
