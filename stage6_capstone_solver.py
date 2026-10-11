"""
================================================================================
Kernel0X CTF Play Box — Stage 6 Solver Script
Stage 6: Capstone Live Target — Kernel0X's Final Message
Author: Member 3 (Challenge Design B)
Module: SLIIT IE3132 Penetration Testing
Target: SSH Privilege Access, LSB Steganography, & Multi-Layer XOR Decryption (LO1, LO2, LO3)
================================================================================
"""

import sys
import os

def vigenere_decrypt(ciphertext, key):
    key = key.upper()
    plain = []
    k_idx = 0
    for ch in ciphertext:
        if 'a' <= ch <= 'z':
            shift = ord(key[k_idx % len(key)]) - ord('A')
            plain.append(chr((ord(ch) - ord('a') - shift + 26) % 26 + ord('a')))
            k_idx += 1
        elif 'A' <= ch <= 'Z':
            shift = ord(key[k_idx % len(key)]) - ord('A')
            plain.append(chr((ord(ch) - ord('A') - shift + 26) % 26 + ord('A')))
            k_idx += 1
        else:
            plain.append(ch)
    return "".join(plain)

def xor_decrypt(hex_string, key_bytes):
    raw_bytes = bytes.fromhex(hex_string)
    decrypted_bytes = bytes([b ^ key_bytes[i % len(key_bytes)] for i, b in enumerate(raw_bytes)])
    return decrypted_bytes.decode("utf-8", errors="replace")

def solve_stage6():
    if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
        try:
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass

    print("=" * 70)
    print(" [STAGE 6 SOLVER] CAPSTONE MULTI-LAYER EXPLOITATION & CRYPTANALYSIS")
    print(" Member 3: Challenge Design B | IE3132 Penetration Testing")
    print("=" * 70)

    print("\n[+] --- STEP 1: AUTHENTICATED SSH TARGET ACCESS ---")
    print("    [*] Target Host     : 47.129.24.175 (AWS EC2 Linux Sandbox)")
    print("    [*] Port            : 2222 (Restricted SSH Service)")
    print("    [*] Username        : k0x_operator (Derived from Stage 1/5)")
    print("    [*] Password        : Kernel0X{warehouse9_vigenere} (Stage 5 Flag)")
    print("    [>] Live Command    : ssh -p 2222 k0x_operator@47.129.24.175")

    print("\n[+] --- STEP 2: HOST FORENSICS & LSB STEGANOGRAPHY LAYER ---")
    print("    [*] Dead-Drop Asset : /opt/stage6/dead-drop.png (or /home/k0x_operator/dead-drop.jpg)")
    print("    [*] Steg Analysis   : zsteg /opt/stage6/dead-drop.png (LSB Bitplane Analysis)")
    lsb_extracted = "VICRQU_YTB=SRELK"
    print(f"    [+] Extracted Layer 1 Ciphertext: {lsb_extracted}")

    print("\n[+] --- STEP 3: INTERMEDIATE VIGENÈRE DECRYPT (KEY: DEADDROP) ---")
    layer1_plain = vigenere_decrypt(lsb_extracted, "DEADDROP")
    print(f"    Decrypted Layer 1 Clue: {layer1_plain}")
    second_key = "ORBIT"
    print(f"    [!] RECOVERED LAYER 2 XOR KEY: '{second_key}'")

    print("\n[+] --- STEP 4: HIDDEN ARTIFACT RECONNAISSANCE & DOTFILE PARSING ---")
    print("    [>] Command Executed: ls -la ~")
    print("    [+] Hidden File Found: ~/.final-message")
    hex_ciphertext = "043730273123621a32302a332616303d3d3216262a312d3f313d372634"
    print(f"    [+] Recovered Hex Ciphertext: {hex_ciphertext}")

    print("\n[+] --- STEP 5: REPEATING XOR DECRYPTION WITH KEY 'ORBIT' ---")
    final_flag = xor_decrypt(hex_ciphertext, second_key.encode("utf-8"))
    print(f"    Decrypted Final Plaintext:")
    print(f"    --> {final_flag}")

    print("\n[+] --- STEP 6: CAPSTONE FLAG SUBMISSION ---")
    print(f"    [★ FINAL CTF FLAG] {final_flag}")
    print("\n[*] Upon submission:")
    print("    - Awards: 200 Points + Speed XP Bonus (Max CTF Score)")
    print("    - Portal: Triggers KERNEL0X Complete Celebration Modal")
    print("    - Completion: Directs operative to /thank-you page with Certificate")
    print("=" * 70)

    return final_flag

if __name__ == "__main__":
    solve_stage6()
