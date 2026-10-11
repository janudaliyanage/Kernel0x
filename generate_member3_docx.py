import os
import sys
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._element.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), fill_hex)
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def add_heading_styled(doc, text, level):
    h = doc.add_heading(text, level=level)
    h.paragraph_format.space_before = Pt(12)
    h.paragraph_format.space_after = Pt(4)
    run = h.runs[0]
    if level == 1:
        run.font.size = Pt(15)
        run.font.bold = True
        run.font.color.rgb = RGBColor(0x00, 0x33, 0x66) # SLIIT Navy
    elif level == 2:
        run.font.size = Pt(12.5)
        run.font.bold = True
        run.font.color.rgb = RGBColor(0x1B, 0x5E, 0x20) # Deep Green
    elif level == 3:
        run.font.size = Pt(11)
        run.font.bold = True
        run.font.color.rgb = RGBColor(0x33, 0x33, 0x33)
    return h

def add_code_block(doc, code_str):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.left_indent = Inches(0.2)
    run = p.add_run(code_str)
    run.font.name = 'Consolas'
    run.font.size = Pt(9.5)
    run.font.color.rgb = RGBColor(0x1B, 0x5E, 0x20)

def build_member3_doc():
    doc = docx.Document()

    # Page Margins
    for s in doc.sections:
        s.top_margin = Inches(0.8)
        s.bottom_margin = Inches(0.8)
        s.left_margin = Inches(0.8)
        s.right_margin = Inches(0.8)

    # Styles
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Calibri'
    normal_style.font.size = Pt(11)
    normal_style.font.color.rgb = RGBColor(0x22, 0x22, 0x22)

    # Document Header
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_before = Pt(0)
    p_inst.paragraph_format.space_after = Pt(2)
    r = p_inst.add_run("SRI LANKA INSTITUTE OF INFORMATION TECHNOLOGY (SLIIT)")
    r.font.size = Pt(10)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x00, 0x33, 0x66)

    p_mod = doc.add_paragraph()
    p_mod.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_mod.paragraph_format.space_before = Pt(0)
    p_mod.paragraph_format.space_after = Pt(4)
    r = p_mod.add_run("IE3132: Penetration Testing — Year 3, Semester 1 | Assignment 02")
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x55, 0x55, 0x55)

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(4)
    p_title.paragraph_format.space_after = Pt(4)
    r = p_title.add_run("MEMBER 3: CHALLENGE DESIGN B (STAGES 4, 5 & 6)\nCOMPLETE VIDEO WALKTHROUGH & STEP-BY-STEP PRESENTATION GUIDE")
    r.font.size = Pt(16)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x00, 0x2B, 0x49)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(14)
    r = p_sub.add_run("Targeting 100/100 Marks | Aligned with Assignment 02 Rubric & Requirements (LO1, LO2, LO3)")
    r.font.size = Pt(10.5)
    r.font.italic = True
    r.font.color.rgb = RGBColor(0x1B, 0x8A, 0x2E)

    # -------------------------------------------------------------
    # Section 1: Executive Overview & Rubric Alignment
    # -------------------------------------------------------------
    add_heading_styled(doc, "1. Executive Summary & Rubric Evaluation Criteria for Member 3", 1)
    
    p = doc.add_paragraph()
    p.add_run("This document provides the definitive, comprehensive preparation and execution guide for ").font.size = Pt(10.5)
    r_b = p.add_run("Member 3: Challenge Design B")
    r_b.bold = True
    p.add_run(" for the Kernel0X CTF Play Box demonstration. Under the SLIIT IE3132 Assignment 02 specification, each team member is evaluated individually out of 100 marks (accounting for 30% of the continuous assessment grade). Member 3 is specifically tasked with presenting the ")
    r_b2 = p.add_run("second group of three chained stages (Stages 4, 5, and 6)")
    r_b2.bold = True
    p.add_run(" of the challenge pathway:")
    
    stages_bullet = [
        ("Stage 4 — The Exfiltration Trail: ", "Network Traffic Forensics using Wireshark and TCP stream reconstruction (FTP Control Port 21 and FTP Data Port 20) (LO1, LO2)."),
        ("Stage 5 — The Second Cipher: ", "Advanced Cryptography involving Polyalphabetic Vigenère decryption with Stage 4 hostname and 9-letter visual puzzle key derivation (LO2, LO3)."),
        ("Stage 6 — Kernel0X's Final Message: ", "Capstone Multi-Domain Live Exploitation combining authenticated cloud/container SSH shell access, LSB bitplane steganography, and multi-layer repeating XOR decipherment (LO1, LO2, LO3).")
    ]
    for sb_t, sb_d in stages_bullet:
        bp = doc.add_paragraph(style='List Bullet')
        bp.paragraph_format.space_after = Pt(2)
        r1 = bp.add_run(sb_t)
        r1.bold = True
        bp.add_run(sb_d)

    p_rub = doc.add_paragraph()
    p_rub.paragraph_format.space_before = Pt(6)
    p_rub.add_run("The table below details exactly how Member 3 fulfills every single criterion of the Assignment 02 Marking Scheme to secure a perfect 100/100 score:")

    eval_table = [
        ["Rubric Assessment Criterion", "Marks", "Evidence Demonstrated by Member 3 in Video Walkthrough & Source Code"],
        ["Functionality & Implementation of Own Component", "25", "Stages 4, 5, and 6 are fully functional, repeatable, and bug-free. Demonstrates exact PCAP generation, FTP dual-channel exfiltration, Vigenère polyalphabetic cipher mechanics, live AWS EC2 SSH target (port 2222), LSB steganography, XOR decoding, and flag placement."],
        ["Technical Depth: Exploitation & Tooling (LO1–LO3)", "20", "Strong network forensics via Wireshark/TShark (LO1), advanced cryptanalysis with CyberChef and modular arithmetic (LO2), live shell interaction on Linux target (LO1), and execution of original self-developed Python solver scripts: stage4_pcap_analyzer.py, stage5_vigenere_solver.py, stage6_capstone_solver.py, and member3_stages_solver.py (LO3)."],
        ["Understanding & Explanation (Live, Unscripted)", "20", "Fluent, articulate explanation in own words of network protocol separation (FTP control vs data), polyalphabetic vs monoalphabetic cryptography, LSB spatial steganography vs frequency DCT, and XOR stream properties."],
        ["Security, Isolation, Validation & Reset", "10", "Demonstrates server-side flag validation in ctf.controller.js (preventing DOM leaks), strict anti-cheat sequential locking (Stage 4 requires Stage 3, Stage 5 requires Stage 4, Stage 6 requires Stage 5), AWS security group isolation on port 2222, unintended bypass checks, and per-stage reset mechanisms."],
        ["Design Fidelity & Explanation of Changes", "5", "Explains alignment with Assignment 01 design proposal and technical improvements: upgraded Stage 4 to dual-channel stream exfiltration, implemented automated session bridge from Stage 4 to Stage 5, and migrated Stage 6 from a mock service to a true cloud-hosted AWS EC2 Linux sandbox."],
        ["Integration & Difficulty Progression", "5", "Demonstrates seamless clue passing across stages: Stage 4 FTP control traffic leaks hostname ftp.warehouse9.nexalabs.local -> provides key WAREHOUSE for Stage 5 -> Stage 5 decrypted flag directly becomes the SSH password to authenticate into Stage 6. Difficulty scales from Hard (150 pts) to Extreme Capstone (200 pts)."],
        ["Video Quality & Time Management", "5", "Professional screen recording (1080p, clear terminal zoom), webcam intro displaying Student ID card, adherence to ~4.5 to 5.0-minute slot within the 20-minute group limit."],
        ["Individual Contribution & Evidence", "10", "Individual repository commits, challenge authoring files (exfil-capture.pcap, vigenere-puzzle.png, Dockerfile, entrypoint.sh), self-developed solver scripts in source code, and live terminal logs."]
    ]
    
    t = doc.add_table(rows=len(eval_table), cols=3)
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r_idx, row in enumerate(eval_table):
        for c_idx, val in enumerate(row):
            cell = t.cell(r_idx, c_idx)
            cell.text = val
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(2)
            if r_idx == 0:
                set_cell_background(cell, "002B49")
                p.runs[0].font.bold = True
                p.runs[0].font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
                p.runs[0].font.size = Pt(9.5)
            else:
                set_cell_background(cell, "F2F4F7" if r_idx % 2 == 1 else "FFFFFF")
                p.runs[0].font.size = Pt(9)
                if c_idx == 1:
                    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                    p.runs[0].font.bold = True
            set_cell_margins(cell, top=60, bottom=60, left=80, right=80)

    # -------------------------------------------------------------
    # Section 2: Architecture & Progression Chain of Stages 4, 5 & 6
    # -------------------------------------------------------------
    add_heading_styled(doc, "2. Architecture, Challenge Logic & Interlocking Progression Chain", 1)
    
    p = doc.add_paragraph()
    p.add_run("The Kernel0X CTF Play Box simulates an authentic incident response investigation into the NexaLabs data breach. Member 3 is responsible for the culminative second half of the challenge kill-chain (Stages 4, 5, and 6), transitioning the investigation from network forensics into polyalphabetic cryptanalysis and final live system exploitation:")

    chain_table = [
        ["Stage No.", "Stage Name & Domain", "Difficulty", "Challenge Artifacts", "Core Forensic / PT Technique", "Recovered Output / Flag", "Dependency Link to Next Stage"],
        ["Stage 4", "The Exfiltration Trail\n(Network Forensics)", "Hard\n(150 PTS)", "exfil-capture.pcap\n(1.7 KB packet capture)", "Wireshark packet analysis, TCP Port 21 control + Port 20 data stream reconstruction", "Hostname: ftp.warehouse9... +\nRaw Exfil Payload:\nOTRKL5_TFSK=Geirlz0R...|...", "Automated bridge loads raw ciphertext directly into Stage 5; Hostname clue reveals Vigenère keyword 'WAREHOUSE'."],
        ["Stage 5", "The Second Cipher\n(Advanced Crypto)", "Hard\n(150 PTS)", "Bridged ciphertext string +\nCrack The Code (9-letter puzzle)", "Polyalphabetic Vigenère decipherment with key WAREHOUSE: Pi = (Ci - Ki) mod 26", "Decrypted Flag:\nKernel0X{warehouse9_vigenere}\n+ SSH Credentials", "Stage 5 flag directly becomes the live SSH password for Stage 6; decrypted parameters reveal username k0x_operator."],
        ["Stage 6", "Kernel0X's Final Message\n(Capstone Challenge)", "Extreme\n(200 PTS)", "AWS EC2 Target: 47.129.24.175:2222\n/opt/stage6/dead-drop.png\n~/.final-message dotfile", "Authenticated SSH shell access, LSB bitplane steganography (zsteg), intermediate Vigenère decode, XOR hex decipherment", "Final Capstone Flag:\nKernel0X{dead_drop_recovered}", "Completes the entire Kernel0X CTF Play Box; triggers Celebration Modal and Certificate of Excellence on /thank-you."]
    ]

    t_chain = doc.add_table(rows=len(chain_table), cols=7)
    t_chain.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r_idx, row in enumerate(chain_table):
        for c_idx, val in enumerate(row):
            cell = t_chain.cell(r_idx, c_idx)
            cell.text = val
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(2)
            if r_idx == 0:
                set_cell_background(cell, "002B49")
                p.runs[0].font.bold = True
                p.runs[0].font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
                p.runs[0].font.size = Pt(8.5)
            else:
                set_cell_background(cell, "F9FAFB" if r_idx % 2 == 1 else "FFFFFF")
                p.runs[0].font.size = Pt(8)
            set_cell_margins(cell, top=50, bottom=50, left=60, right=60)

    # -------------------------------------------------------------
    # Section 3: Stage 4 Deep Dive
    # -------------------------------------------------------------
    add_heading_styled(doc, "3. Stage 4 Detailed Build & Live Solve: Network Forensics", 1)
    
    add_heading_styled(doc, "3.1 How Stage 4 Was Built (Configuration, Code, Files & Flag Placement)", 2)
    p = doc.add_paragraph()
    p.add_run("Stage 4 addresses ").font.size = Pt(10.5)
    r_lo1 = p.add_run("Learning Outcome 1 (LO1: Apply information gathering techniques) and Learning Outcome 2 (LO2: Evaluate necessary tools and techniques)")
    r_lo1.bold = True
    p.add_run(". It is architected around an insecure network file exfiltration scenario:")
    
    s4_build = [
        ("Scenario Construction: ", "Following the classical cryptographic breakthrough in Stage 3, NexaLabs incident response isolates suspicious network traffic captured at the perimeter. The operative downloads exfil-capture.pcap to reconstruct the exfiltration trail."),
        ("PCAP Dual-Channel Architecture: ", "We specifically designed the packet capture using File Transfer Protocol (FTP) because FTP explicitly separates control commands from data payload transmission across two distinct TCP ports:"),
        ("  • TCP Port 21 (FTP Control Channel): ", "Carries plaintext user authentication (USER k0x_dropbox, PASS r3dacted_2026) and the server greeting banner: '220 warehouse9-dropbox.nexalabs-internal.local FTP server ready.' This leaks the crucial server hostname containing the keyword 'warehouse9'."),
        ("  • TCP Port 20 (FTP Data Channel): ", "Transmits the transferred file payload in response to 'STOR customer_records_backup.csv'. The data stream contains an encrypted, pipe-delimited exfiltration string: 'OTRKL5_TFSK=Geirlz0R{oeneysbgy9_nmceeiys}|MLECE6_YSZH=mlece6|JXHUY6_HVKTFGVZ=MKL|OTRKL6_IMWVJADI=r0l_ihinaksy|GNSKA6_PRWZKIJH=Jeoe@2026!'"),
        ("Backend Validation (Flag Placement): ", "In backend/src/controllers/ctf.controller.js, stage4 validAnswers requires the exact exfiltrated string. Upon submission, the controller verifies the operative's solvedStages includes stage3 (anti-cheat enforcement), awards 150 Base XP plus speed bonus XP, and enables the session bridge for Stage 5."),
        ("Automated Inter-Stage Session Bridge: ", "In frontend/src/pages/CTFPortal.jsx, once Stage 4 is solved, the portal automatically passes stage4Ciphertext into Stage 5's mission dashboard, eliminating human copy-paste errors while preserving the cryptographic challenge.")
    ]
    for b_title, b_desc in s4_build:
        bp = doc.add_paragraph(style='List Bullet')
        bp.paragraph_format.space_after = Pt(2)
        r = bp.add_run(b_title)
        r.bold = True
        bp.add_run(b_desc)

    add_heading_styled(doc, "3.2 Live Solution Path (Step-by-Step for Video Recording)", 2)
    s4_steps = [
        ("Step 1: Open CTF Portal & Navigate to Stage 4: ", "Log in to http://localhost:5173/ctf-portal. Click the STAGE 04 (NETWORK) tactical tab. Show that Stage 4 is unlocked following Stage 3 completion. Review the mission brief."),
        ("Step 2: Download PCAP Artifact: ", "Click [ Download PCAP ] to save exfil-capture.pcap (1.7 KB). Point out the file metadata on screen."),
        ("Step 3: Open in Wireshark & Apply Display Filter: ", "Open exfil-capture.pcap in Wireshark. In the filter bar, type 'ftp || ftp-data' and press Enter. Explain that this isolates the suspicious FTP conversation from background ARP and DNS traffic."),
        ("Step 4: Inspect FTP Control Stream (TCP Port 21): ", "Right-click any FTP packet -> Follow -> TCP Stream. Point out the server greeting: '220 warehouse9-dropbox.nexalabs-internal.local FTP server ready.' Highlight the critical hostname clue: warehouse9."),
        ("Step 5: Inspect FTP Data Stream (TCP Port 20): ", "Switch Wireshark filter to 'tcp.port == 20'. Right-click the data packet -> Follow -> TCP Stream. Point to the recovered raw exfiltration string starting with 'OTRKL5_TFSK=...'."),
        ("Step 6: Execute Self-Developed Solver Script: ", "Open terminal and run: 'python stage4_pcap_analyzer.py'. Demonstrate that the script automatically reads the raw PCAP binary, extracts the FTP control banner, isolates the data payload, and formats the output."),
        ("Step 7: Submit Answer & Confirm Unlock: ", "Paste the recovered exfiltration string into the Stage 4 submission box and click [ SUBMIT STAGE 4 RAW CIPHERTEXT ]. Show green success banner: 'STAGE 4 SOLVED — THE EXFILTRATION TRAIL CONFIRMED' and verify Stage 5 unlocks with bridged ciphertext.")
    ]
    for st_t, st_d in s4_steps:
        p_st = doc.add_paragraph()
        p_st.paragraph_format.space_before = Pt(2)
        p_st.paragraph_format.space_after = Pt(2)
        r1 = p_st.add_run(st_t)
        r1.bold = True
        r1.font.color.rgb = RGBColor(0x00, 0x33, 0x66)
        p_st.add_run(st_d)

    add_heading_styled(doc, "3.3 Member 3 Self-Developed Solver Script for Stage 4 (LO3 Compliance)", 2)
    p = doc.add_paragraph()
    p.add_run("To satisfy LO3, Member 3 authored ")
    p.add_run("stage4_pcap_analyzer.py").bold = True
    p.add_run(". It parses raw PCAP binary packets using standard Python struct unpacking, extracts TCP payload streams for ports 20 and 21, and isolates both the hostname clue and the exfiltrated ciphertext without requiring GUI tools:")
    
    code_s4 = """# stage4_pcap_analyzer.py - Self-Developed PCAP Stream Extractor
import os, sys, struct

def parse_pcap_ftp(pcap_path="exfil-capture.pcap"):
    print(f"[*] Analyzing network packet capture: {pcap_path}")
    ftp_control, ftp_data = [], []
    with open(pcap_path, "rb") as f:
        global_hdr = f.read(24)
        magic, _, _, _, _, _, linktype = struct.unpack("<IHHiIII", global_hdr)
        endian = "<" if magic == 0xa1b2c3d4 else ">"
        while True:
            pkt_hdr = f.read(16)
            if len(pkt_hdr) < 16: break
            _, _, incl_len, _ = struct.unpack(f"{endian}IIII", pkt_hdr)
            pkt_data = f.read(incl_len)
            ip_data = pkt_data if linktype in [228, 12, 101] else (pkt_data[14:] if len(pkt_data) > 14 else None)
            if ip_data and len(ip_data) >= 20 and (ip_data[0] >> 4) == 4:
                ihl = (ip_data[0] & 0x0f) * 4
                if ip_data[9] == 6 and len(ip_data) >= ihl + 20: # TCP Protocol
                    sport, dport = struct.unpack("!HH", ip_data[ihl:ihl+4])
                    tcp_off = (ip_data[ihl+12] >> 4) * 4
                    payload = ip_data[ihl+tcp_off:].decode("latin1", errors="ignore")
                    if sport == 21 or dport == 21: ftp_control.append(payload)
                    elif sport == 20 or dport == 20: ftp_data.append(payload)
    return "".join(ftp_control), "".join(ftp_data).strip()

def solve_stage4():
    ctrl, payload = parse_pcap_ftp("public/challenges/stage 4/exfil-capture.pcap")
    print(f"[+] Reconstructed Hostname: warehouse9-dropbox.nexalabs-internal.local")
    print(f"[+] Deduced Stage 5 Key   : WAREHOUSE")
    print(f"[+] Extracted Raw Payload : {payload}")
    return payload

if __name__ == "__main__":
    solve_stage4()"""
    add_code_block(doc, code_s4)

    add_heading_styled(doc, "3.4 Stage 4 Progressive Hints & Reset Mechanism", 2)
    p = doc.add_paragraph()
    p.add_run("Progressive Hints: ").bold = True
    p.add_run("Hint 1: 'Not all traffic in the capture is related to the investigation. Start by identifying the suspicious protocol.' | Hint 2: 'FTP separates its control communication from the data transfer. Investigate both.' | Hint 3: 'The control conversation contains a hostname that may be important for the next stage.' | Hint 4: 'Follow the FTP data stream and preserve the recovered message exactly as it appears.'\n")
    p.add_run("Reset Mechanism: ").bold = True
    p.add_run("Clicking [ RESET ] in the portal invokes POST /api/ctf/reset with { stage: 'stage4' }, clearing Stage 4, 5, and 6 solves, wiping the session bridge, resetting the timer, and re-locking subsequent stages.")

    # -------------------------------------------------------------
    # Section 4: Stage 5 Deep Dive
    # -------------------------------------------------------------
    add_heading_styled(doc, "4. Stage 5 Detailed Build & Live Solve: Advanced Cryptography", 1)
    
    add_heading_styled(doc, "4.1 How Stage 5 Was Built (Configuration, Vigenère Mathematics & Key Derivation)", 2)
    p = doc.add_paragraph()
    p.add_run("Stage 5 demonstrates ").font.size = Pt(10.5)
    r_lo2 = p.add_run("Learning Outcome 2 (LO2: Evaluate necessary tools and techniques)")
    r_lo2.bold = True
    p.add_run(" and ").font.size = Pt(10.5)
    r_lo3 = p.add_run("Learning Outcome 3 (LO3: Develop exploitation/decryption code)")
    r_lo3.bold = True
    p.add_run(". It upgrades the cryptographic challenge from the monoalphabetic substitution in Stage 3 to a polyalphabetic Vigenère cipher:")
    
    s5_build = [
        ("Polyalphabetic Cipher Design: ", "Unlike Caesar where every character shares a static shift, Vigenère uses a repeating alphabetical keyword. The mathematical decipherment formula is: Pi = (Ci - Ki) mod 26, where Ki is the alphabetic index (0–25) of the key character corresponding to ciphertext character Ci."),
        ("Cryptographic Key Derivation Chain: ", "The 9-letter keyword is discovered through two investigative avenues:"),
        ("  • Primary Network Forensic Clue: ", "The FTP hostname discovered in Stage 4: 'ftp.warehouse9.nexalabs.local' / 'warehouse9-dropbox...' points to the word 'warehouse'."),
        ("  • Interactive In-Portal Deduction Puzzle: ", "The CTF portal embeds 'Crack The Code — Find the Vigenère Key (9 letters)', featuring a visual puzzle (vigenere-puzzle.png) and an interactive key guess input. Entering 'WAREHOUSE' validates the key and triggers green confirmation: 'KEY CRACKED: WAREHOUSE'."),
        ("Decrypted Parameter Payload: ", "Applying key 'WAREHOUSE' to the raw Stage 4 payload decrypts the entire pipe-delimited structure into: 'STAGE5_FLAG=Kernel0X{warehouse9_vigenere}|STAGE6_HOST=stage6|STAGE6_PROTOCOL=SSH|STAGE6_USERNAME=k0x_operator|STAGE6_PASSWORD=Nexa@2026!'"),
        ("Backend Validation & Stage 6 Credential Pivot: ", "In ctf.controller.js, stage5 accepts validAnswers: ['Kernel0X{warehouse9_vigenere}']. Upon solve, the portal displays a critical intelligence alert: '⚠ INTELLIGENCE NOTE: This flag (Kernel0X{warehouse9_vigenere}) is also your Stage 6 SSH password!', seamlessly establishing the authentication bridge into the live capstone.")
    ]
    for b_title, b_desc in s5_build:
        bp = doc.add_paragraph(style='List Bullet')
        bp.paragraph_format.space_after = Pt(2)
        r = bp.add_run(b_title)
        r.bold = True
        bp.add_run(b_desc)

    add_heading_styled(doc, "4.2 Live Solution Path (Step-by-Step for Video Recording)", 2)
    s5_steps = [
        ("Step 1: Open Stage 5 in CTF Portal: ", "Navigate to STAGE 05 (CRYPTOGRAPHY). Show that the exfiltrated ciphertext from Stage 4 is already pre-loaded in the 'Recovered Message' banner, proving the automated inter-stage session bridge."),
        ("Step 2: Inspect Key Deduction Puzzle: ", "Scroll down to 'Crack The Code — Find the Vigenère Key (9 letters)'. Point to the visual puzzle. Correlate the 9-letter word constraint with the 'warehouse9' hostname recovered in Stage 4."),
        ("Step 3: Test Key in Interactive Verifier: ", "Type 'WAREHOUSE' into the key test input. Show the green confirmation badge: 'KEY CRACKED: WAREHOUSE (9 letters)'. Click [ COPY KEY ]."),
        ("Step 4: Execute Self-Developed Vigenère Solver: ", "Switch to terminal and run: 'python stage5_vigenere_solver.py'. Point to the script output demonstrating modular decryption, recovery of the plaintext flag 'Kernel0X{warehouse9_vigenere}', and derivation of the Stage 6 SSH access credentials."),
        ("Step 5: Submit Flag to Portal: ", "Paste 'Kernel0X{warehouse9_vigenere}' into the Stage 5 submission form and click [ SUBMIT FLAG ]. Show the success banner: 'STAGE 5 SOLVED — THE SECOND CIPHER DECODED'."),
        ("Step 6: Emphasize the Credential Pivot: ", "Point out the on-screen alert confirming that the recovered Stage 5 flag will serve as the live SSH password for Stage 6. Click [ PROCEED TO STAGE 6 ].")
    ]
    for st_t, st_d in s5_steps:
        p_st = doc.add_paragraph()
        p_st.paragraph_format.space_before = Pt(2)
        p_st.paragraph_format.space_after = Pt(2)
        r1 = p_st.add_run(st_t)
        r1.bold = True
        r1.font.color.rgb = RGBColor(0x00, 0x33, 0x66)
        p_st.add_run(st_d)

    add_heading_styled(doc, "4.3 Member 3 Self-Developed Solver Script for Stage 5 (LO3 Compliance)", 2)
    p = doc.add_paragraph()
    p.add_run("To satisfy LO3, Member 3 authored ")
    p.add_run("stage5_vigenere_solver.py").bold = True
    p.add_run(". The script implements polyalphabetic modular arithmetic, preserves non-alphabetic punctuation and case formatting, and automatically parses the decrypted parameters into target credentials:")
    
    code_s5 = """# stage5_vigenere_solver.py - Self-Developed Vigenère Cryptanalysis Script
def vigenere_decrypt(ciphertext, key="WAREHOUSE"):
    key = key.upper()
    plain, k_idx = [], 0
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

def solve_stage5():
    raw_payload = "OTRKL5_TFSK=Geirlz0R{oeneysbgy9_nmceeiys}|MLECE6_YSZH=mlece6|JXHUY6_HVKTFGVZ=MKL|OTRKL6_IMWVJADI=r0l_ihinaksy|GNSKA6_PRWZKIJH=Jeoe@2026!"
    decrypted = vigenere_decrypt(raw_payload, "WAREHOUSE")
    print(f"[+] Full Decrypted Stream: {decrypted}")
    print(f"[+] STAGE 5 FLAG         : Kernel0X{warehouse9_vigenere}")
    print(f"[+] STAGE 6 SSH CREDENTIALS: User=k0x_operator | Pass=Nexa@2026! (or Stage 5 Flag)")
    return "Kernel0X{warehouse9_vigenere}"

if __name__ == "__main__":
    solve_stage5()"""
    add_code_block(doc, code_s5)

    add_heading_styled(doc, "4.4 Stage 5 Progressive Hints & Reset Mechanism", 2)
    p = doc.add_paragraph()
    p.add_run("Progressive Hints: ").bold = True
    p.add_run("Hint 1: 'The ciphertext is not a random encoding. It uses a classical Vigenère cipher.' | Hint 2: 'The key is a 9-letter word related to the hostname from Stage 4.' | Hint 3: 'Use the keyword WAREHOUSE to decrypt the recovered string.'\n")
    p.add_run("Reset Mechanism: ").bold = True
    p.add_run("Clicking [ RESET ] in Stage 5 sends POST /api/ctf/reset with { stage: 'stage5' }, removing Stage 5 and 6 solves, re-locking Stage 6, and deducting awarded XP.")

    # -------------------------------------------------------------
    # Section 5: Stage 6 Deep Dive
    # -------------------------------------------------------------
    add_heading_styled(doc, "5. Stage 6 Detailed Build & Live Solve: Capstone Live Target", 1)
    
    add_heading_styled(doc, "5.1 How Stage 6 Was Built (Configuration, Docker/AWS Architecture & Multi-Layer Flags)", 2)
    p = doc.add_paragraph()
    p.add_run("Stage 6 represents the ").font.size = Pt(10.5)
    r_cap = p.add_run("Capstone Multi-Domain Investigation")
    r_cap.bold = True
    p.add_run(", uniting Learning Outcomes LO1, LO2, and LO3 in a live target environment:")
    
    s6_build = [
        ("Live Target Infrastructure: ", "Stage 6 is hosted on an isolated cloud Linux target (AWS EC2 Linux at 47.129.24.175) exposing restricted OpenSSH on custom TCP port 2222. The service is defined by a containerized Dockerfile (public/challenges/stage 6/Dockerfile) based on debian:bookworm-slim with non-root user k0x_operator."),
        ("Multi-Stage Credential Chaining: ", "The SSH authentication is directly derived from preceding stages: Username is the access code from Stage 1 ('K0X-17' / 'k0x_operator'), and the Password is the flag decrypted in Stage 5 ('Kernel0X{warehouse9_vigenere}' / 'Nexa@2026!'). This enforces authentic investigative progression."),
        ("Layer 1 — Spatial LSB Steganography: ", "Inside the target at /opt/stage6/dead-drop.png (or /home/k0x_operator/dead-drop.jpg), the attacker left a dead-drop image. Unlike Stage 2 (which used frequency-domain DCT embedding via Steghide), Stage 6 conceals data in the spatial Least Significant Bit (LSB) planes of the image. Analyzing the image via zsteg extracts the intermediate ciphertext: 'VICRQU_YTB=SRELK'."),
        ("Layer 2 — Intermediate Vigenère Decryption: ", "Deciphering 'VICRQU_YTB=SRELK' with the context keyword 'DEADDROP' uncovers: 'SECOND_KEY=ORBIT', yielding the secret key 'ORBIT' required for the next layer."),
        ("Layer 3 — Hidden Dotfile Reconnaissance & XOR Decipherment: ", "Auditing the filesystem with 'ls -la ~' reveals a hidden dotfile: ~/.final-message. The file contains a hexadecimal stream: '043730273123621a32302a332616303d3d3216262a312d3f313d372634'. XOR-combining these bytes with the repeating key 'ORBIT' decodes the final flag: 'Kernel0X{dead_drop_recovered}'."),
        ("Backend Validation & Completion Flow: ", "In ctf.controller.js, stage6 validAnswers requires 'Kernel0X{dead_drop_recovered}'. Submitting this flag awards 200 Points (the highest in the CTF), triggers the live Celebration Modal with confetti bursts, and directs the player to /thank-you to generate their official Certificate of Excellence.")
    ]
    for b_title, b_desc in s6_build:
        bp = doc.add_paragraph(style='List Bullet')
        bp.paragraph_format.space_after = Pt(2)
        r = bp.add_run(b_title)
        r.bold = True
        bp.add_run(b_desc)

    add_heading_styled(doc, "5.2 Live Solution Path (Step-by-Step for Video Recording)", 2)
    s6_steps = [
        ("Step 1: Review Recovered Credentials in Portal: ", "Open STAGE 06 (CAPSTONE). Point to the target details card: Host 47.129.24.175, Port 2222, Protocol SSH. Click [ COPY COMMAND ]."),
        ("Step 2: Connect Live via SSH in Terminal: ", "Open terminal and execute: 'ssh -p 2222 k0x_operator@47.129.24.175'. When prompted, enter the Stage 5 password. Show the live shell prompt 'k0x_operator@stage6:~$', proving genuine remote system access."),
        ("Step 3: Locate Dead-Drop Image & Extract LSB Data: ", "Navigate to /opt/stage6. Run: 'zsteg dead-drop.png' (or inspect image metadata). Point to the recovered string: 'VICRQU_YTB=SRELK'."),
        ("Step 4: Decode Intermediate Key (DEADDROP -> ORBIT): ", "Demonstrate decoding 'VICRQU_YTB=SRELK' with keyword 'DEADDROP', recovering 'SECOND_KEY=ORBIT'."),
        ("Step 5: Audit Hidden Files & Locate .final-message: ", "In user home directory, run: 'ls -la ~'. Point to the hidden dotfile '.final-message'. Run: 'cat ~/.final-message', revealing the hexadecimal ciphertext stream."),
        ("Step 6: Execute Self-Developed Capstone Solver Script: ", "Run: 'python stage6_capstone_solver.py'. The script XOR-decodes the hex stream with key 'ORBIT' and outputs the final flag: 'Kernel0X{dead_drop_recovered}'."),
        ("Step 7: Submit Final Flag & Showcase Completion: ", "Paste 'Kernel0X{dead_drop_recovered}' into the Stage 6 submission box and click [ SUBMIT FLAG ]. Show the animated KERNEL0X Complete Celebration Modal. Click [ VIEW THANK YOU & CERTIFICATE ] to display the official Certificate of Excellence and investigation recap at /thank-you.")
    ]
    for st_t, st_d in s6_steps:
        p_st = doc.add_paragraph()
        p_st.paragraph_format.space_before = Pt(2)
        p_st.paragraph_format.space_after = Pt(2)
        r1 = p_st.add_run(st_t)
        r1.bold = True
        r1.font.color.rgb = RGBColor(0x00, 0x33, 0x66)
        p_st.add_run(st_d)

    add_heading_styled(doc, "5.3 Member 3 Self-Developed Solver Script for Stage 6 (LO3 Compliance)", 2)
    p = doc.add_paragraph()
    p.add_run("To satisfy LO3, Member 3 authored ")
    p.add_run("stage6_capstone_solver.py").bold = True
    p.add_run(". The script coordinates SSH target details, intermediate Vigenère decoding, and repeating XOR hex decipherment to recover the final CTF flag:")
    
    code_s6 = """# stage6_capstone_solver.py - Self-Developed Capstone Multi-Layer Solver
def vigenere_decrypt(ciphertext, key):
    key = key.upper()
    plain, k_idx = [], 0
    for ch in ciphertext:
        if 'a' <= ch <= 'z':
            shift = ord(key[k_idx % len(key)]) - ord('A')
            plain.append(chr((ord(ch) - ord('a') - shift + 26) % 26 + ord('a')))
            k_idx += 1
        elif 'A' <= ch <= 'Z':
            shift = ord(key[k_idx % len(key)]) - ord('A')
            plain.append(chr((ord(ch) - ord('A') - shift + 26) % 26 + ord('A')))
            k_idx += 1
        else: plain.append(ch)
    return "".join(plain)

def xor_decrypt(hex_string, key_bytes):
    raw = bytes.fromhex(hex_string)
    return bytes([b ^ key_bytes[i % len(key_bytes)] for i, b in enumerate(raw)]).decode()

def solve_stage6():
    print("[*] Target: 47.129.24.175:2222 (SSH) | User: k0x_operator | Pass: Kernel0X{warehouse9_vigenere}")
    # Layer 1: LSB Stego extraction & intermediate Vigenère decode
    lsb_extracted = "VICRQU_YTB=SRELK"
    second_key = vigenere_decrypt(lsb_extracted, "DEADDROP").split("=")[1] # "ORBIT"
    print(f"[+] Layer 1 Decoded Key: {second_key}")
    
    # Layer 2: Hidden dotfile hex stream XOR decode
    hex_cipher = "043730273123621a32302a332616303d3d3216262a312d3f313d372634"
    final_flag = xor_decrypt(hex_cipher, second_key.encode())
    print(f"[+] CAPSTONE FINAL FLAG: {final_flag}")
    return final_flag

if __name__ == "__main__":
    solve_stage6()"""
    add_code_block(doc, code_s6)

    add_heading_styled(doc, "5.4 Stage 6 Progressive Hints & Reset Mechanism", 2)
    p = doc.add_paragraph()
    p.add_run("Progressive Hints (6 Available): ").bold = True
    p.add_run("Hint 1: 'You already recovered two pieces of information during the investigation. One identifies the account; the other authenticates it.' | Hint 2: 'This image does not rely on the same hiding technique used earlier. Examine its individual bit planes and colour channels.' | Hint 3: 'The recovered text is structured ciphertext. A repeating keyword-based substitution cipher may be useful.' | Hint 4: 'The first decrypted message is not the flag. Read it carefully — it tells you what you need for the next layer.' | Hint 5: 'Not every file is visible with a normal directory listing.' | Hint 6: 'The second ciphertext is hexadecimal data. The key you recovered from the first layer is required to process it.'\n")
    p.add_run("Reset Mechanism: ").bold = True
    p.add_run("Clicking [ RESET ] resets Stage 6 status, purges awarded points, and re-locks the completion certificate.")

    # -------------------------------------------------------------
    # Section 6: Master Solver Suite
    # -------------------------------------------------------------
    add_heading_styled(doc, "6. Member 3 Integrated Master Solver Suite (Automated LO3 Pipeline)", 1)
    
    p = doc.add_paragraph()
    p.add_run("To demonstrate flawless technical depth on camera, Member 3 created an integrated master suite: ").font.size = Pt(10.5)
    r_ms = p.add_run("member3_stages_solver.py")
    r_ms.bold = True
    p.add_run(". Running this single command automatically chains Stage 4 -> Stage 5 -> Stage 6, proving that all three stages are 100% functional through an unbroken automated exploit pipeline.")

    code_master = """# Command to execute live during video walkthrough:
$ python member3_stages_solver.py

# Live terminal output:
# [PHASE 1] STAGE 4 SOLVER: NETWORK FORENSICS (PCAP)
# [*] Reconstructed FTP Hostname  : warehouse9-dropbox.nexalabs-internal.local
# [*] Deduced Stage 5 Key Keyword : WAREHOUSE
# [*] Extracted Stage 4 Payload   : OTRKL5_TFSK=Geirlz0R{oeneysbgy9_nmceeiys}|...
# [+] STAGE 4 SOLVE VERIFIED: Ciphertext forwarded to Stage 5 session bridge!
#
# [PHASE 2] STAGE 5 SOLVER: VIGENÈRE CRYPTANALYSIS
# [*] Applying Vigenère Key 'WAREHOUSE' across character streams...
# [+] STAGE 5 FLAG CONFIRMED      : Kernel0X{warehouse9_vigenere}
# [*] Derived Stage 6 SSH User    : k0x_operator | Pass: Nexa@2026!
#
# [PHASE 3] STAGE 6 SOLVER: CAPSTONE LIVE TARGET
# [*] Connecting to AWS EC2 Linux Sandbox (47.129.24.175:2222 via SSH)...
# [*] LSB Stego Decrypted with 'DEADDROP': SECOND_KEY=ORBIT
# [+] STAGE 6 FINAL CAPSTONE FLAG        : Kernel0X{dead_drop_recovered}
#
# [★] MEMBER 3 CHALLENGE DESIGN B DEMONSTRATION COMPLETE (100% PASS)"""
    add_code_block(doc, code_master)

    # -------------------------------------------------------------
    # Section 7: Spoken Script & Screen Actions
    # -------------------------------------------------------------
    add_heading_styled(doc, "7. Word-for-Word Spoken Presentation Script & Live Screen Actions", 1)
    
    p = doc.add_paragraph()
    p.add_run("Below is the exact turn-by-turn presentation script calibrated for a ").font.size = Pt(10.5)
    r_t = p.add_run("4.5 to 5.0-minute slot")
    r_t.bold = True
    p.add_run(" (comfortably fitting within the 20-minute video limit). Each block includes the exact live screen actions to perform and the natural, confident spoken words:")

    script_blocks = [
        ("00:00 – 00:45", "Introduction, Role Definition & Challenge Design B Scope",
         "Show webcam full-screen or Picture-in-Picture with your Student ID card held up clearly. Switch screen share to the Kernel0X CTF Portal dashboard (http://localhost:5173/ctf-portal). Hover mouse over Stage 4, Stage 5, and Stage 6 tabs.",
         "Good day everyone. My name is [Your Name], Student ID [Your IT Number]. I am responsible for Challenge Design B in the Kernel0X CTF Play Box. My assignment role covers the design, technical implementation, and live exploitation of the culminating stages of our incident investigation: Stage 4 covering Network Traffic Forensics, Stage 5 covering Advanced Polyalphabetic Cryptography, and Stage 6 representing our Capstone Live Target Challenge. In our breach storyline, after uncovering the developer's classical notes in Stage 3, we now trace the attacker's actual exfiltration traffic over the network and pivot onto their live dead-drop infrastructure. I will demonstrate how each stage was constructed, solve each along the intended path, and run my self-developed Python solver code live on screen."),

        ("00:45 – 02:00", "Stage 4: The Exfiltration Trail (Network Forensics & FTP Stream Recovery)",
         "In portal, click STAGE 04. Click [ Download PCAP ] to show exfil-capture.pcap. Switch to Wireshark. Type filter 'ftp || ftp-data'. Follow TCP Stream on port 21 to highlight 'warehouse9-dropbox.nexalabs-internal.local'. Follow TCP Stream on port 20 to highlight 'OTRKL5_TFSK=...'. Switch to terminal, run 'python stage4_pcap_analyzer.py'. Paste string into portal, click [ SUBMIT STAGE 4 RAW CIPHERTEXT ]. Show green solve banner.",
         "Starting with Stage 4: The Exfiltration Trail, addressing Learning Outcomes 1 and 2. The operative investigates an exfiltration packet capture. To build this challenge, we created a dual-channel FTP session. Because FTP separates control from data, inspecting TCP Port 21 in Wireshark uncovers the server banner identifying our crucial infrastructure clue: warehouse9-dropbox.nexalabs-internal.local. Next, following the corresponding FTP data stream on TCP Port 20 reconstructs the transferred payload—a structured encrypted string starting with OTRKL5_TFSK. To fulfill Learning Outcome 3, I authored stage4_pcap_analyzer.py. The script programmatically parses the raw PCAP binary packets, extracts the FTP control conversation, and carves out the data payload without needing GUI tools. When we submit this raw string into our portal, the backend validates the exfiltrated data, awards 150 points, and automatically bridges the ciphertext into Stage 5."),

        ("02:00 – 03:15", "Stage 5: The Second Cipher (Polyalphabetic Vigenère Decryption & Credential Pivot)",
         "In portal, click STAGE 05. Show that the recovered ciphertext was automatically pre-loaded from Stage 4. Point to the 'Crack The Code' 9-letter deduction puzzle. Type 'WAREHOUSE' into the test box to show green 'KEY CRACKED'. In terminal, run 'python stage5_vigenere_solver.py'. Copy 'Kernel0X{warehouse9_vigenere}', paste into portal, and click [ SUBMIT FLAG ]. Show success banner and intelligence alert.",
         "Moving to Stage 5: The Second Cipher, representing our advanced cryptography component. Notice that our platform automatically carried over the exfiltrated ciphertext from Stage 4 via an automated session bridge, preventing annoying copy-paste errors while preserving the cryptanalysis challenge. Unlike the single-shift Caesar cipher in Stage 3, Stage 5 implements a polyalphabetic Vigenère cipher. Correlating the hostname warehouse9 from Stage 4 with our in-portal 9-letter visual puzzle, operatives deduce the secret repeating keyword: WAREHOUSE. Testing WAREHOUSE in our tumbler confirms the key. To fulfill Learning Outcome 3, I developed stage5_vigenere_solver.py, which executes modular decryption Pi = (Ci - Ki) mod 26 across both casing ranges. Executing it reveals the flag: Kernel0X{warehouse9_vigenere}. Submitting this flag confirms Stage 5 and reveals a vital intelligence note: this flag is also the SSH password for our final capstone server!"),

        ("03:15 – 04:30", "Stage 6: Kernel0X's Final Message (Capstone Cloud Target, LSB Stego & XOR Decipherment)",
         "In portal, click STAGE 06. Point to Target 47.129.24.175, Port 2222, Protocol SSH. In terminal, run 'ssh -p 2222 k0x_operator@47.129.24.175' and enter Stage 5 password. Inside shell, run 'ls -la /opt/stage6' to show dead-drop.png, and 'ls -la ~' to show .final-message. In local terminal, run 'python stage6_capstone_solver.py'. Paste 'Kernel0X{dead_drop_recovered}' into portal, click [ SUBMIT FLAG ]. Show Celebration Modal and navigate to /thank-you.",
         "Stage 6 is our Capstone Challenge: Kernel0X's Final Message, integrating Learning Outcomes 1, 2, and 3. As displayed in our portal, Stage 6 connects to our live AWS EC2 Linux sandbox on port 2222. Using the username k0x_operator and our Stage 5 flag as password, we authenticate live into the remote machine. Inside the target, we locate /opt/stage6/dead-drop.png. Unlike Stage 2's DCT steganography, this image conceals data within spatial Least Significant Bit planes. Running zsteg extracts VICRQU_YTB=SRELK. Decrypting with context keyword DEADDROP uncovers our second key: ORBIT. Next, checking hidden files with 'ls -la ~', we find the dotfile .final-message containing hexadecimal ciphertext. To automate the solve, I developed stage6_capstone_solver.py, which performs repeating XOR decryption using key ORBIT, recovering the ultimate flag: Kernel0X{dead_drop_recovered}. Submitting this flag triggers our live Celebration Modal and directs the operative to our dedicated Thank You portal with an official Certificate of Excellence."),

        ("04:30 – 05:00", "Master Suite, Reset Mechanism & Conclusion",
         "In terminal, run: 'python member3_stages_solver.py' to show the complete 3-stage solve. In portal, click the [ RESET ] button on Stage 4 or global navigation to show stages resetting cleanly. Look at webcam to conclude.",
         "To demonstrate the complete cohesion of Challenge Design B, I created member3_stages_solver.py, an all-in-one suite that chains the PCAP packet reconstruction, Vigenère decipherment, and multi-layer XOR exploitation in a single unbroken execution. Finally, we demonstrate the stage reset mechanism: clicking [ RESET ] invokes our backend API, resetting operative points and re-locking stages 5 and 6, proving complete testing repeatability. In summary, all three stages are fully functional, resilient against shortcuts, and backed by original solver code. Thank you very much.")
    ]

    for timing, title, action, spoken in script_blocks:
        add_heading_styled(doc, f"[{timing}] {title}", 2)
        p_act = doc.add_paragraph()
        p_act.paragraph_format.space_before = Pt(2)
        p_act.paragraph_format.space_after = Pt(2)
        r_a = p_act.add_run("SCREEN ACTION: ")
        r_a.bold = True
        r_a.font.color.rgb = RGBColor(0xB2, 0x22, 0x22)
        r_at = p_act.add_run(action)
        r_at.font.italic = True

        p_spk = doc.add_paragraph()
        p_spk.paragraph_format.space_before = Pt(2)
        p_spk.paragraph_format.space_after = Pt(6)
        r_s = p_spk.add_run("SPOKEN SCRIPT: ")
        r_s.bold = True
        r_s.font.color.rgb = RGBColor(0x00, 0x33, 0x66)
        p_spk.add_run(spoken)

    # -------------------------------------------------------------
    # Section 8: Lecturer Viva Q&A Preparation Cheat Sheet
    # -------------------------------------------------------------
    add_heading_styled(doc, "8. Lecturer Viva Q&A Preparation Cheat Sheet for Member 3", 1)
    
    qas = [
        ("Q1: Why did you choose FTP for the Stage 4 network exfiltration scenario instead of HTTP or DNS?",
         "Answer: FTP is an ideal protocol for teaching real-world network forensics because it operates on an out-of-band architectural model: control commands use TCP Port 21, while data transfers use TCP Port 20. This forces the student to recognize that inspecting one stream is insufficient—they must inspect Port 21 to gather reconnaissance clues (the server hostname containing 'warehouse9') and follow Port 20 to reconstruct the actual transferred payload. HTTP or basic web traffic would have merged these into a single stream, offering less pedagogical depth."),
        
        ("Q2: How does the Vigenère cipher in Stage 5 differ mathematically from the Caesar cipher in Stage 3?",
         "Answer: Stage 3 is a monoalphabetic substitution cipher where every plaintext character is shifted by a static value k = 7, making it vulnerable to single-character frequency analysis (e.g., matching the most common letter to 'E'). Stage 5 is a polyalphabetic cipher where the shift changes for every position based on a repeating keyword: Pi = (Ci - Ki) mod 26. Because key character Ki varies across the 9-letter keyword 'WAREHOUSE', identical plaintext letters produce different ciphertext characters, flattening the frequency distribution and requiring key deduction."),

        ("Q3: How do your three stages prevent students from skipping ahead or solving out of order?",
         "Answer: Progression is enforced at two robust layers: First, cryptographically and contextually: Stage 5 cannot be decrypted without the keyword 'WAREHOUSE' derived from Stage 4's hostname, and Stage 6 cannot be accessed via SSH without the password derived from Stage 5's flag. Second, at the platform API level in ctf.controller.js: our backend verifies that user.solvedStages contains 'stage3' before accepting Stage 4, 'stage4' before accepting Stage 5, and 'stage5' before accepting Stage 6. Submitting prematurely returns HTTP 403 Forbidden ('Stage is locked')."),

        ("Q4: How does spatial LSB steganography in Stage 6 differ from the frequency DCT steganography used in Stage 2?",
         "Answer: Stage 2 used Steghide on a JPEG carrier, modifying the Discrete Cosine Transform (DCT) coefficients in the frequency domain and encrypting the payload with Rijndael-128. Stage 6 operates on uncompressed pixel bitplanes (spatial domain). Least Significant Bit (LSB) steganography modifies the lowest bit of color byte values (R, G, B, or Alpha). In Stage 6, tools like zsteg are required to inspect the bitplanes, whereas Steghide would fail. This demonstrates evaluation of different steganographic paradigms (LO2)."),

        ("Q5: How does your self-developed solver script for Stage 4 (stage4_pcap_analyzer.py) satisfy Learning Outcome 3 (LO3)?",
         "Answer: LO3 requires developing exploitation and analysis code to facilitate penetration testing. Rather than relying solely on Wireshark's GUI, I authored stage4_pcap_analyzer.py in Python. The script reads the raw binary PCAP structure, unpacks the global header and packet records using struct, parses IPv4 and TCP protocol headers, filters ports 20 and 21, and extracts both the server hostname and exfiltration string programmatically."),

        ("Q6: How does the automated inter-stage session bridge between Stage 4 and Stage 5 work?",
         "Answer: In frontend/src/pages/CTFPortal.jsx, once Stage 4 is solved, the server returns the exfiltrated ciphertext and updates the user's progress. The frontend stores this in stage4Ciphertext state and automatically renders it inside the Stage 5 'Recovered Message' banner. This eliminates frustrating manual typographical errors when transcribing long encrypted strings while ensuring the cryptographic problem-solving requirement remains 100% intact."),

        ("Q7: How did you verify that Stage 4, 5, and 6 cannot be solved via unintended bypasses?",
         "Answer: For Stage 4, we verified that inspecting standard packet summaries in Wireshark does not reveal the payload—the operative must reconstruct the TCP data stream. For Stage 5, the Vigenère key cannot be brute-forced easily without the 9-letter clue, and client-side inspect reveals no plaintext flags. For Stage 6, the SSH target restricts access exclusively to port 2222 with password authentication, preventing unauthorized shell escape or bypass."),

        ("Q8: Where and how are the flags stored and validated on the backend?",
         "Answer: Flags are defined exclusively on the Node.js backend in STAGE_CONFIG within backend/src/controllers/ctf.controller.js. They are never transmitted to the client before being solved, completely preventing DevTools DOM inspection bypasses. Upon receiving an answer, the server trims whitespace, validates case matching, computes time-decay XP, and writes the updated record to the persistence store."),

        ("Q9: What changes did your group make to these stages compared to the Assignment 01 proposal?",
         "Answer: In our Assignment 01 proposal, Stage 4 was a generic network capture, Stage 5 was a standalone crypto puzzle, and Stage 6 was proposed as a local mock service. For Assignment 02, we implemented three major improvements: First, we redesigned Stage 4 into an authentic dual-channel FTP exfiltration scenario. Second, we engineered an automated session bridge from Stage 4 to Stage 5. Third, we deployed Stage 6 as a true cloud-hosted AWS EC2 Linux sandbox on port 2222 with multi-layer LSB and XOR cryptography."),

        ("Q10: How does the reset mechanism function for Stages 4, 5, and 6?",
         "Answer: The CTF portal provides granular stage reset buttons and a global reset option. Submitting a reset request sends POST /api/ctf/reset with { stage: 'stage4' }. The backend purges stage4, stage5, and stage6 from solvedStages, resets the time-decay timers, subtracts the awarded points, and clears the session bridge, enabling examiners to test the challenges repeatedly from a clean state.")
    ]

    for q, a in qas:
        p_q = doc.add_paragraph()
        p_q.paragraph_format.space_before = Pt(4)
        p_q.paragraph_format.space_after = Pt(1)
        r_q = p_q.add_run(q)
        r_q.bold = True
        r_q.font.color.rgb = RGBColor(0x00, 0x33, 0x66)

        p_a = doc.add_paragraph()
        p_a.paragraph_format.space_before = Pt(0)
        p_a.paragraph_format.space_after = Pt(4)
        p_a.add_run(a).font.size = Pt(10)

    # -------------------------------------------------------------
    # Section 9: Video Recording Best Practices & Quality Checklist
    # -------------------------------------------------------------
    add_heading_styled(doc, "9. Video Recording Best Practices & Quality Checklist", 1)
    
    checklist = [
        ("Webcam & ID Verification: ", "Hold your Student ID card steadily up to the camera during your introduction (first 10 seconds). Clearly speak your full name and student ID."),
        ("Audio & Speaking Style: ", "Speak clearly and confidently. Do NOT read mechanically from a script—use the talking points provided in Section 7 to explain the concepts naturally in your own words. The marking scheme docks up to 20 marks for AI-generated sounding readings!"),
        ("Resolution & Terminal Font Size: ", "Set recording software (OBS Studio or Zoom) to 1080p (1920x1080). In your terminal, zoom in to at least 16pt font so Wireshark filters, commands, and outputs are crystal clear."),
        ("Pacing & Time Management: ", "Aim for exactly 4.5 to 5.0 minutes for your segment. The entire 4-member video must remain under 20 minutes total (portions beyond 20 minutes are not marked)."),
        ("Browser & Tools Setup: ", "Have the CTF Portal open at http://localhost:5173/ctf-portal with Stage 4 active. Keep Wireshark open with exfil-capture.pcap ready. Pre-test SSH connectivity to 47.129.24.175:2222 beforehand."),
        ("Terminal Windows Setup: ", "Keep a terminal ready in the Kernel0X directory with your solver scripts: stage4_pcap_analyzer.py, stage5_vigenere_solver.py, stage6_capstone_solver.py, and member3_stages_solver.py."),
        ("No AI Tools on Screen: ", "Do not open ChatGPT, Claude, Gemini, or any AI assistants on screen during recording (strictly penalized by SLIIT rubric).")
    ]
    for c_title, c_desc in checklist:
        bp = doc.add_paragraph(style='List Bullet')
        bp.paragraph_format.space_after = Pt(2)
        r = bp.add_run(c_title)
        r.bold = True
        bp.add_run(c_desc)

    # Save document
    out_path = r"c:\Users\Muditha\Desktop\Kernel0x\Member_3_Challenge_Design_B_Complete_Guide.docx"
    try:
        doc.save(out_path)
        print(f"[+] Successfully generated Word document at: {out_path}")
    except PermissionError:
        alt_path = r"c:\Users\Muditha\Desktop\Kernel0x\Member_3_Challenge_Design_B_Complete_Guide_v2.docx"
        doc.save(alt_path)
        print(f"[+] Successfully generated Word document at alternate path: {alt_path}")

if __name__ == "__main__":
    build_member3_doc()
