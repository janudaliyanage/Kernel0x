"""
================================================================================
Kernel0X CTF Play Box — Stage 4 Solver Script
Stage 4: Network Forensics — The Exfiltration Trail
Author: Member 3 (Challenge Design B)
Module: SLIIT IE3132 Penetration Testing
Target: PCAP FTP Stream Reconstruction & Exfiltration String Recovery (LO1, LO2, LO3)
================================================================================
"""

import os
import sys
import struct

def find_pcap_file():
    candidates = [
        os.path.join("public", "challenges", "stage 4", "exfil-capture.pcap"),
        os.path.join("public", "challenges", "stage4", "exfil-capture.pcap"),
        "exfil-capture.pcap",
        os.path.join("..", "public", "challenges", "stage 4", "exfil-capture.pcap")
    ]
    for p in candidates:
        if os.path.isfile(p):
            return p
    return None

def parse_pcap_ftp(pcap_path):
    print(f"[*] Analyzing network packet capture: {pcap_path}")
    if not os.path.isfile(pcap_path):
        print(f"[-] Error: File not found at {pcap_path}")
        return None, None

    ftp_control_traffic = []
    ftp_data_traffic = []

    with open(pcap_path, "rb") as f:
        # PCAP Global Header (24 bytes)
        global_hdr = f.read(24)
        if len(global_hdr) < 24:
            print("[-] Error: Invalid PCAP header.")
            return None, None

        magic, maj, min_v, tz, sig, snaplen, linktype = struct.unpack("<IHHiIII", global_hdr)
        # Check endianness
        little_endian = (magic == 0xa1b2c3d4)
        endian_char = "<" if little_endian else ">"

        pkt_count = 0
        while True:
            pkt_hdr = f.read(16)
            if len(pkt_hdr) < 16:
                break
            pkt_count += 1
            sec, usec, incl_len, orig_len = struct.unpack(f"{endian_char}IIII", pkt_hdr)
            pkt_data = f.read(incl_len)

            # Determine IP offset based on linktype
            ip_data = None
            if linktype == 228 or linktype == 12 or linktype == 101: # Raw IPv4
                ip_data = pkt_data
            elif linktype == 1: # Ethernet (14-byte MAC header)
                if len(pkt_data) > 14:
                    eth_type = struct.unpack("!H", pkt_data[12:14])[0]
                    if eth_type == 0x0800:
                        ip_data = pkt_data[14:]
            else:
                # Fallback: check if packet starts with IPv4 version 4
                if len(pkt_data) > 20 and (pkt_data[0] >> 4) == 4:
                    ip_data = pkt_data

            if ip_data and len(ip_data) >= 20:
                ihl = (ip_data[0] & 0x0f) * 4
                protocol = ip_data[9]
                if protocol == 6 and len(ip_data) >= ihl + 20: # TCP
                    sport, dport = struct.unpack("!HH", ip_data[ihl:ihl+4])
                    tcp_offset = (ip_data[ihl+12] >> 4) * 4
                    payload = ip_data[ihl+tcp_offset:]

                    if sport == 21 or dport == 21: # FTP Control
                        if payload:
                            ftp_control_traffic.append(payload.decode("latin1", errors="ignore"))
                    elif sport == 20 or dport == 20: # FTP Data
                        if payload:
                            ftp_data_traffic.append(payload.decode("latin1", errors="ignore"))

    control_str = "".join(ftp_control_traffic)
    data_str = "".join(ftp_data_traffic).strip()

    return control_str, data_str

def solve_stage4():
    print("=" * 70)
    print(" [STAGE 4 SOLVER] NETWORK PCAP FTP STREAM RECONSTRUCTION")
    print(" Member 3: Challenge Design B | IE3132 Penetration Testing")
    print("=" * 70)

    if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
        try:
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass

    pcap_path = find_pcap_file()
    if not pcap_path:
        print("[-] Error: 'exfil-capture.pcap' not located in standard challenge paths.")
        sys.exit(1)

    control_log, data_payload = parse_pcap_ftp(pcap_path)

    print("\n[+] --- STEP 1: FTP CONTROL CONVERSATION (TCP PORT 21) ---")
    for line in control_log.splitlines():
        if line.strip():
            print(f"    [FTP-CTL] {line.strip()}")
            if "220" in line and "warehouse9" in line:
                hostname = "warehouse9-dropbox.nexalabs-internal.local"
                print(f"\n    [!] CRITICAL DISCOVERY: Server Hostname: {hostname}")
                print(f"    [!] DERIVED KEYWORD: Cryptographic Key Clue: WAREHOUSE")

    print("\n[+] --- STEP 2: FTP DATA STREAM RECONSTRUCTION (TCP PORT 20) ---")
    print(f"    [FTP-DATA] Raw Exfiltrated Payload Recovered:")
    print(f"    --> {data_payload}\n")

    print("[+] --- STEP 3: SUBMISSION VERIFICATION ---")
    print("    Submit the full recovered string exactly into the Stage 4 form:")
    print(f"    Answer: {data_payload}")
    print("\n[*] Upon submission:")
    print("    - Awards: 150 Points + Speed XP Bonus")
    print("    - Inter-stage bridge: Passes recovered ciphertext to Stage 5")
    print("    - Status: Unlocks Stage 5 — The Second Cipher")
    print("=" * 70)

    return data_payload

if __name__ == "__main__":
    solve_stage4()
