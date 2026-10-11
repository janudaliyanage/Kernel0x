"""
================================================================================
Kernel0X CTF Play Box — Stage 5 Solver Script
Stage 5: Advanced Cryptography — The Second Cipher (Polyalphabetic Decryption)
Author: Member 3 (Challenge Design B)
Module: SLIIT IE3132 Penetration Testing
Target: Vigenère Decryption & Live Credential Recovery (LO2, LO3)
================================================================================
"""

import sys

def vigenere_decrypt(ciphertext, key="WAREHOUSE"):
    """
    Decodes polyalphabetic Vigenère ciphertext:
    Formula: Pi = (Ci - Ki) mod 26
    Preserves uppercase/lowercase character casing, numbers, and punctuation.
    """
    key = key.upper()
    decrypted_chars = []
    key_idx = 0

    for ch in ciphertext:
        if 'a' <= ch <= 'z':
            shift = ord(key[key_idx % len(key)]) - ord('A')
            plain_char = chr((ord(ch) - ord('a') - shift + 26) % 26 + ord('a'))
            decrypted_chars.append(plain_char)
            key_idx += 1
        elif 'A' <= ch <= 'Z':
            shift = ord(key[key_idx % len(key)]) - ord('A')
            plain_char = chr((ord(ch) - ord('A') - shift + 26) % 26 + ord('A'))
            decrypted_chars.append(plain_char)
            key_idx += 1
        else:
            # Pass punctuation, braces, numbers, underscores through unchanged
            decrypted_chars.append(ch)

    return "".join(decrypted_chars)

def solve_stage5(raw_payload=None):
    if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
        try:
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass

    print("=" * 70)
    print(" [STAGE 5 SOLVER] VIGENÈRE POLYALPHABETIC CRYPTANALYSIS")
    print(" Member 3: Challenge Design B | IE3132 Penetration Testing")
    print("=" * 70)

    if not raw_payload:
        raw_payload = (
            "OTRKL5_TFSK=Geirlz0R{oeneysbgy9_nmceeiys}|"
            "MLECE6_YSZH=mlece6|"
            "JXHUY6_HVKTFGVZ=MKL|"
            "OTRKL6_IMWVJADI=r0l_ihinaksy|"
            "GNSKA6_PRWZKIJH=Jeoe@2026!"
        )

    print("\n[+] --- STEP 1: KEY DERIVATION & VALIDATION ---")
    print("    [!] Source 1: Stage 4 FTP Hostname: 'warehouse9-dropbox.nexalabs-internal.local'")
    print("    [!] Source 2: Stage 5 Portal 'Crack The Code' 9-Letter Deduction Puzzle")
    print("    [!] Derived Repeating Keyword: 'WAREHOUSE' (Length: 9 Letters)")

    print("\n[+] --- STEP 2: RAW RECOVERED CIPHERTEXT (BRIDGED FROM STAGE 4) ---")
    print(f"    --> {raw_payload}")

    print("\n[+] --- STEP 3: EXECUTE VIGENÈRE DECRYPTION ---")
    decrypted_full = vigenere_decrypt(raw_payload, "WAREHOUSE")
    print(f"    Decrypted Structured Stream:\n    --> {decrypted_full}")

    # Parse key-value parameters
    params = {}
    for part in decrypted_full.split("|"):
        if "=" in part:
            k, v = part.split("=", 1)
            params[k.strip()] = v.strip()

    stage5_flag = params.get("STAGE5_FLAG", "Kernel0X{warehouse9_vigenere}")

    print("\n[+] --- STEP 4: RECOVERED STAGE 5 FLAG ---")
    print(f"    [★ FLAG TO SUBMIT] {stage5_flag}")

    print("\n[+] --- STEP 5: CAPSTONE TARGET ACCESS CREDENTIALS DERIVED ---")
    print(f"    [*] Target Host     : {params.get('STAGE6_HOST', '47.129.24.175')}")
    print(f"    [*] Protocol        : {params.get('STAGE6_PROTOCOL', 'SSH (Port 2222)')}")
    print(f"    [*] Username        : {params.get('STAGE6_USERNAME', 'k0x_operator')}")
    print(f"    [*] Password        : {params.get('STAGE6_PASSWORD', 'Nexa@2026!')}")
    print(f"    [!] NOTE: In the live portal, the Stage 5 flag '{stage5_flag}'")
    print(f"        is also configured as the operative SSH authentication credential!")

    print("\n[*] Upon submission:")
    print("    - Awards: 150 Points + Speed XP Bonus")
    print("    - Status: Unlocks Stage 6 — Kernel0X's Final Message (Capstone)")
    print("=" * 70)

    return stage5_flag

if __name__ == "__main__":
    solve_stage5()
