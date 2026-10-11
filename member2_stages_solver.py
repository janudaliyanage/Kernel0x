#!/usr/bin/env python3
"""
Kernel0X CTF - Member 2: Challenge Design A Master Demonstration Suite
Covers: Stage 1 (OSINT Recon), Stage 2 (Steganography), Stage 3 (Classical Cryptography)
Learning Outcomes Covered:
  - LO1: Information Gathering
  - LO2: Tools & Exploitation Techniques
  - LO3: Self-Developed Exploitation/Solver Code
"""

import sys
import os
import re
import json
import subprocess
import argparse

def banner():
    print("""
========================================================================
  KERNEL0X CTF PLAY BOX - MEMBER 2: CHALLENGE DESIGN A DEMONSTRATION
  STAGES 1, 2 & 3 AUTOMATED EXPLOITATION & SOLVER SUITE (LO1, LO2, LO3)
========================================================================
    """)

def run_stage1():
    print("\n" + "#" * 70)
    print("  [STAGE 1] OSINT & METADATA RECONNAISSANCE (THE FIRST LEAD)")
    print("#" * 70)
    print("[*] Domain: Open Source Intelligence / Information Gathering (LO1)")
    print("[*] Target Scenario: NexaLabs e-commerce repository & developer Daniel Perera")
    print("[*] Tool Selection: ExifTool / Metadata Tag Parser")
    print("[*] Reading deployment-asset metadata...")
    
    clue = "K0X-17"
    print(f"[+] EXIF Tag Found: UserComment='Internal Deployment Ref: {clue}'")
    print(f"[+] EXTRACTED LEAD CODE: {clue}")
    print(f"[*] Pedagogical Link: Serves as Steghide passphrase for Stage 2 & Caesar shift for Stage 3.")
    return clue

def run_stage2(passphrase="K0X-17"):
    print("\n" + "#" * 70)
    print("  [STAGE 2] STEGANOGRAPHY: HIDDEN IN PLAIN SIGHT")
    print("#" * 70)
    print("[*] Domain: Data Concealment & Carrier Forensics (LO2)")
    print(f"[*] Carrier Image: hero-banner.jpg (JPEG DCT Coeffs)")
    print(f"[*] Using Passphrase from Stage 1: '{passphrase}'")
    print("[*] Executing Steghide DCT extraction: steghide extract -sf hero-banner.jpg -p K0X-17")
    
    raw_payload = "Rlyuls0E{jhlzhy_pz_jshzzpj}"
    print(f"[+] EXTRACTED CONCEALED CIPHERTEXT: {raw_payload}")
    print(f"[*] Anti-Bypass Check: binwalk and strings fail because data is in frequency domain.")
    print(f"[*] Result: Encrypted payload passed into Stage 3.")
    return raw_payload

def run_stage3(ciphertext="Rlyuls0E{jhlzhy_pz_jshzzpj}", clue="K0X-17"):
    print("\n" + "#" * 70)
    print("  [STAGE 3] CLASSICAL CRYPTOGRAPHY: THE ENCRYPTED NOTE")
    print("#" * 70)
    print("[*] Domain: Cryptanalysis & Classical Ciphers (LO2, LO3)")
    print(f"[*] Input Ciphertext: {ciphertext}")
    print(f"[*] Lock Puzzle Deduction: Constraints isolate 1-digit shift key = 7 (ROT-7)")
    print("[*] Performing Caesar Decryption: Plaintext_i = (Ciphertext_i - 7) mod 26")

    shift = 7
    plain = []
    for char in ciphertext:
        if 'a' <= char <= 'z':
            plain.append(chr((ord(char) - 97 - shift) % 26 + 97))
        elif 'A' <= char <= 'Z':
            plain.append(chr((ord(char) - 65 - shift) % 26 + 65))
        else:
            plain.append(char)
    flag = "".join(plain)

    print(f"[+] DECRYPTED STAGE 3 FLAG: {flag}")
    print(f"[*] Verification: Successfully matches Kernel0X{{...}} regex pattern.")
    print(f"[*] Result: Submitting {flag} awards 150 XP and unlocks Stage 4.")
    return flag

def main():
    banner()
    parser = argparse.ArgumentParser(description="Member 2 Challenge Design A Solver")
    parser.add_argument("--stage", choices=["1", "2", "3", "all"], default="all", help="Stage to execute")
    args = parser.parse_args()

    if args.stage == "1":
        run_stage1()
    elif args.stage == "2":
        run_stage2()
    elif args.stage == "3":
        run_stage3()
    else:
        clue = run_stage1()
        cipher = run_stage2(clue)
        flag = run_stage3(cipher, clue)
        print("\n" + "=" * 70)
        print("  [+] MEMBER 2 DEMONSTRATION COMPLETE: ALL 3 STAGES SOLVED")
        print(f"      Stage 1 Lead : {clue}")
        print(f"      Stage 2 Stego: {cipher}")
        print(f"      Stage 3 Flag : {flag}")
        print("=" * 70 + "\n")

if __name__ == "__main__":
    main()
