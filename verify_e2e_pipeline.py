"""
Kernel0X CTF Play Box — Automated End-to-End Integration Testing & Verification Suite
Author: Member 4 (Integration, Testing & Documentation Lead)
Module: SLIIT IE3132 Penetration Testing — Assignment 02
Purpose: Automated validation of flag progression, stage-locking dependencies,
         unintended-solution barriers, scoring calculations, and platform recovery.
"""

import sys
import time
import socket
import json
import urllib.request
import urllib.error

BASE_URL = "http://localhost:5000/api"
EC2_HOST = "47.129.24.175"
EC2_PORT = 2222

# ANSI Color codes for clean terminal presentation
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
CYAN = "\033[96m"
BOLD = "\033[1m"
RESET = "\033[0m"

test_results = []

def log_test(tc_id, description, passed, detail=""):
    status = f"{GREEN}[PASS]{RESET}" if passed else f"{RED}[FAIL]{RESET}"
    test_results.append((tc_id, description, passed, detail))
    print(f" {BOLD}{tc_id:<8}{RESET} | {description:<52} | {status} | {detail}")

def http_post(endpoint, data, token=None):
    url = f"{BASE_URL}{endpoint}"
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            **({"Authorization": f"Bearer {token}"} if token else {})
        }
    )
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            return response.getcode(), json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        body = json.loads(e.read().decode()) if e.headers.get_content_type() == "application/json" else {}
        return e.code, body
    except Exception as e:
        return 0, {"error": str(e)}

def http_get(endpoint, token=None):
    url = f"{BASE_URL}{endpoint}"
    req = urllib.request.Request(
        url,
        headers={
            **({"Authorization": f"Bearer {token}"} if token else {})
        }
    )
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            return response.getcode(), json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        body = json.loads(e.read().decode()) if e.headers.get_content_type() == "application/json" else {}
        return e.code, body
    except Exception as e:
        return 0, {"error": str(e)}

def run_e2e_suite():
    print(f"\n{CYAN}{'='*85}{RESET}")
    print(f"{BOLD} Kernel0X — End-to-End Integration & Verification Suite (Member 4){RESET}")
    print(f"{CYAN}{'='*85}{RESET}")
    print(f" Target API: {BASE_URL}  |  AWS Sandbox: {EC2_HOST}:{EC2_PORT}\n")

    # 1. Gateway Health Check
    code, res = http_get("/health")
    if code == 200 and res.get("status") == "online":
        log_test("TC-01", "Backend Gateway Health & Liveness Audit", True, "Status: Online (200)")
    else:
        log_test("TC-01", "Backend Gateway Health & Liveness Audit", False, f"HTTP {code}")
        print(f"\n{RED}[!] Backend appears offline at {BASE_URL}. Ensure 'npm run dev' is running.{RESET}")
        return

    # 2. Operative Authentication & Token Issuance
    test_user = f"auditor_{int(time.time())}"
    code, res = http_post("/auth/register", {
        "username": test_user,
        "password": "Password123!",
        "teamName": "M4_Verification_Unit"
    })
    token = res.get("token")
    if code in (200, 201) and token:
        log_test("TC-02", "Automated Operative Registration & JWT Issuance", True, f"User: {test_user}")
    else:
        log_test("TC-02", "Automated Operative Registration & JWT Issuance", False, f"HTTP {code}")
        return

    # 3. Unintended Solution & Anti-Cheat Progression Check (Stage 2 bypass attempt)
    code, res = http_post("/ctf/submit", {"stage": "stage2", "flag": "Rlyuls0E{jhlzhy_pz_jshzzpj}"}, token)
    if code == 403:
        log_test("TC-03", "Sequential Dependency Lock (Stage 2 jump blocked)", True, "HTTP 403 Forbidden")
    else:
        log_test("TC-03", "Sequential Dependency Lock (Stage 2 jump blocked)", False, f"Expected 403, got {code}")

    # 4. Input Sanitization & False Flag Rejection
    code, res = http_post("/ctf/submit", {"stage": "stage1", "flag": "INVALID_FLAG_TRY_AGAIN"}, token)
    if code == 400:
        log_test("TC-04", "Malformed / Invalid Flag Rejection", True, "HTTP 400 Bad Request")
    else:
        log_test("TC-04", "Malformed / Invalid Flag Rejection", False, f"Expected 400, got {code}")

    # 5. Stage 1 Solve (OSINT)
    code, res = http_post("/ctf/submit", {"stage": "stage1", "flag": "K0X-17"}, token)
    s1_pass = code == 200 and "stage1" in res.get("solvedStages", [])
    log_test("TC-05", "Stage 1 Solve: OSINT Metadata Clue (K0X-17)", s1_pass, f"+{res.get('xpEarned', 0)} XP")

    # 6. Stage 2 Solve (Steganography)
    code, res = http_post("/ctf/submit", {"stage": "stage2", "flag": "Rlyuls0E{jhlzhy_pz_jshzzpj}"}, token)
    s2_pass = code == 200 and "stage2" in res.get("solvedStages", [])
    log_test("TC-06", "Stage 2 Solve: Steghide DCT Payload Extraction", s2_pass, f"+{res.get('xpEarned', 0)} XP")

    # 7. Stage 3 Solve (Classical Crypto)
    code, res = http_post("/ctf/submit", {"stage": "stage3", "flag": "Kernel0X{caesar_is_classic}"}, token)
    s3_pass = code == 200 and "stage3" in res.get("solvedStages", [])
    log_test("TC-07", "Stage 3 Solve: Caesar ROT-7 Flag Decryption", s3_pass, f"+{res.get('xpEarned', 0)} XP")

    # 8. Stage 4 Solve (Network Traffic Forensics)
    raw_ftp = "OTRKL5_TFSK=Geirlz0R{oeneysbgy9_nmceeiys}|MLECE6_YSZH=mlece6|JXHUY6_HVKTFGVZ=MKL|OTRKL6_IMWVJADI=r0l_ihinaksy|GNSKA6_PRWZKIJH=Jeoe@2026!"
    code, res = http_post("/ctf/submit", {"stage": "stage4", "flag": raw_ftp}, token)
    s4_pass = code == 200 and "stage4" in res.get("solvedStages", [])
    log_test("TC-08", "Stage 4 Solve: PCAP FTP Stream Exfiltration", s4_pass, f"Bridge: Ciphertext forwarded")

    # 9. Stage 5 Solve (Polyalphabetic Cryptography)
    code, res = http_post("/ctf/submit", {"stage": "stage5", "flag": "Kernel0X{warehouse9_vigenere}"}, token)
    s5_pass = code == 200 and "stage5" in res.get("solvedStages", [])
    log_test("TC-09", "Stage 5 Solve: Vigenere Keyword Decrypt (WAREHOUSE)", s5_pass, "Credentials derived")

    # 10. Stage 6 Solve (Capstone Live Exploit)
    code, res = http_post("/ctf/submit", {"stage": "stage6", "flag": "Kernel0X{dead_drop_recovered}"}, token)
    s6_pass = code == 200 and "stage6" in res.get("solvedStages", [])
    log_test("TC-10", "Stage 6 Solve: Capstone SSH + LSB + XOR Flag", s6_pass, f"Total XP: {res.get('points', 0)}")

    # 11. State Reset & Recovery Verification
    code, res = http_post("/ctf/reset", {}, token)
    reset_pass = code == 200 and len(res.get("solvedStages", [])) == 0 and res.get("points") == 0
    log_test("TC-11", "Platform Recovery: Full Reset & State Purge", reset_pass, "Clean State Restored")

    # 12. Security Isolation Audit (AWS Port Scanning)
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(3.0)
    try:
        conn = s.connect_ex((EC2_HOST, EC2_PORT))
        ssh_online = (conn == 0)
        s.close()
        log_test("TC-12", "Security Isolation: AWS EC2 SSH Port 2222 Liveness", ssh_online, f"{EC2_HOST}:2222 Open")
    except Exception as e:
        log_test("TC-12", "Security Isolation: AWS EC2 SSH Port 2222 Liveness", False, str(e))

    # Summary
    total = len(test_results)
    passed = sum(1 for _, _, p, _ in test_results if p)
    print(f"\n{CYAN}{'-'*85}{RESET}")
    print(f" {BOLD}Verification Summary:{RESET} {passed}/{total} Test Cases Passed ({passed/total*100:.1f}%)")
    if passed == total:
        print(f" {GREEN}{BOLD}Status: ALL INTEGRATION, DEPENDENCY & RESET TESTS PASSED SUCCESSFULLY!{RESET}")
    else:
        print(f" {YELLOW}{BOLD}Status: Some tests encountered deviations. Check log details above.{RESET}")
    print(f"{CYAN}{'='*85}{RESET}\n")

if __name__ == "__main__":
    run_e2e_suite()
