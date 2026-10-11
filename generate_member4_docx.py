import os
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

def build_member4_doc():
    doc = docx.Document()

    # Margins
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
    r = p_title.add_run("MEMBER 4: INTEGRATION, TESTING & DOCUMENTATION\nCOMPLETE WALKTHROUGH & DEMONSTRATION GUIDE")
    r.font.size = Pt(16)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x00, 0x2B, 0x49)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(14)
    r = p_sub.add_run("Targeting 100/100 Marks | Aligned with Assignment 02 Rubric & Requirements")
    r.font.size = Pt(10.5)
    r.font.italic = True
    r.font.color.rgb = RGBColor(0x1B, 0x8A, 0x2E)

    # Executive Overview
    add_heading_styled(doc, "1. Executive Summary & Evaluation Criteria for Member 4", 1)
    
    p = doc.add_paragraph()
    p.add_run("This document provides the definitive, comprehensive guide for ").font.size = Pt(10.5)
    r_b = p.add_run("Member 4: Integration, Testing & Documentation")
    r_b.bold = True
    p.add_run(" for the Kernel0X CTF Play Box demonstration. Under the SLIIT IE3132 Assignment 02 specifications, each member is evaluated individually out of 100 marks (worth 30% of the overall course grade).")

    # Marking Scheme Table for Member 4
    eval_table = [
        ["Rubric Assessment Criterion", "Marks", "Evidence Demonstrated by Member 4 in Video & Code"],
        ["Functionality & Implementation of Own Component", "25", "Fully working platform integration, end-to-end stage chaining, automated E2E testing pipeline, repeatable reset mechanism."],
        ["Technical Depth: Tooling & Automation (LO1–LO3)", "20", "Self-developed automated integration & verification test script (verify_e2e_pipeline.py) executed live in terminal."],
        ["Understanding & Explanation (Live, Unscripted)", "20", "Fluent, technical explanation of architecture, stage locking, anti-cheat barriers, scoring algorithms, and recovery."],
        ["Security, Isolation, Validation & Reset", "10", "Demonstration of live reset API, AWS EC2 Security Group network isolation (port 2222), and risk register execution."],
        ["Design Fidelity & Explanation of Changes", "5", "Detailed comparative analysis justifying all evolutions from the Assignment 01 approved proposal to Assignment 02."],
        ["Integration & Difficulty Progression", "5", "Demonstration of coherent clue passing across all 6 stages and seamless difficulty curve (Easy -> Capstone)."],
        ["Video Quality & Time Management", "5", "Clear screen recording, 1080p legibility, professional camera introduction with Student ID, precise timing adherence."],
        ["Individual Contribution & Evidence", "10", "Commit history, written test cases, bug log (defects found & fixed), risk register documentation, and test logs."]
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

    # Section 2: End-to-End Flow & Progression
    add_heading_styled(doc, "2. End-to-End Flow, Dependencies & Flag Progression Chain", 1)
    
    p = doc.add_paragraph()
    p.add_run("The Kernel0X Play Box is architected around a realistic cyber incident response scenario (the NexaLabs data breach). Rather than presenting disconnected puzzles, every stage produces an intelligence artifact that directly feeds into subsequent stages:")

    flow_table = [
        ["Stage", "Domain", "Difficulty", "Input / Clue Fed In", "Exploitation / Forensic Technique", "Output / Flag Produced", "Dependency Link to Next Stage"],
        ["Stage 1", "OSINT & Recon", "Easy", "Daniel Perera commit history", "EXIF metadata extraction (ExifTool)", "Clue: K0X-17", "Used as Steghide passphrase in Stage 2, Caesar key in Stage 3, and SSH user in Stage 6."],
        ["Stage 2", "Steganography", "Easy", "hero-banner.jpg + clue K0X-17", "Steghide DCT extraction", "Ciphertext: Rlyuls0E{jhlzhy_pz_jshzzpj}", "Ciphertext is directly passed to Stage 3 for classical decoding."],
        ["Stage 3", "Classical Crypto", "Moderate", "Ciphertext + Stage 1 clue", "Caesar substitution (ROT-7 based on '17')", "Flag: Kernel0X{caesar_is_classic}", "Unlocks Stage 4 network forensic investigation."],
        ["Stage 4", "Network Forensics", "Moderate", "exfil-capture.pcap", "Wireshark / Scapy FTP stream reconstruction", "Hostname: ftp.warehouse9... + Exfil string", "Automated bridge loads raw ciphertext into Stage 5; Hostname reveals Vigenère key."],
        ["Stage 5", "Polyalphabetic Crypto", "Mod-Hard", "Raw ciphertext + Hostname clue", "Vigenère decryption with key WAREHOUSE", "Flag: Kernel0X{warehouse9_vigenere}", "This flag becomes the live SSH password for Stage 6."],
        ["Stage 6", "Live Capstone Sandbox", "Hard (Capstone)", "SSH: K0X-17 + Stage 5 flag", "AWS SSH shell + zsteg LSB + XOR dotfile decrypt", "Final Flag: Kernel0X{dead_drop_recovered}", "Triggers completion celebration, XP calculation, and Thank You certification."]
    ]

    t_flow = doc.add_table(rows=len(flow_table), cols=7)
    t_flow.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r_idx, row in enumerate(flow_table):
        for c_idx, val in enumerate(row):
            cell = t_flow.cell(r_idx, c_idx)
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

    # Anti-cheat explanation
    p_ac = doc.add_paragraph()
    p_ac.paragraph_format.space_before = Pt(8)
    r = p_ac.add_run("Strict Sequential Anti-Cheat Enforcement: ")
    r.bold = True
    p_ac.add_run("The Express backend gateway (ctf.controller.js) enforces strict relational prerequisites. If an operative attempts to submit a flag for Stage N without having solved Stage N-1, the server returns an immediate HTTP 403 Forbidden with a locked error response. Flags are evaluated exclusively server-side, preventing client-side script inspection or DOM tampering.")

    # Section 3: Testing Evidence, Test Cases & Defects Fixed
    add_heading_styled(doc, "3. Testing Evidence: Test Matrix, Defects Found & Unintended Solutions", 1)
    
    add_heading_styled(doc, "3.1 Master Test Cases Matrix", 2)
    test_cases = [
        ["Test Case ID", "Category", "Description & Preconditions", "Expected Result", "Observed Result", "Status"],
        ["TC-01", "Health & Core", "Backend Gateway /api/health probe", "HTTP 200, status: 'online'", "HTTP 200, service online", "PASS"],
        ["TC-02", "Authentication", "User registration with codename & password", "HTTP 201, valid JWT token issued", "JWT issued, user stored in userStore", "PASS"],
        ["TC-03", "Anti-Cheat", "Attempt Stage 2 flag submission before Stage 1", "HTTP 403 Forbidden ('Stage 2 is locked')", "HTTP 403 returned, state unchanged", "PASS"],
        ["TC-04", "Fuzzing / Bypass", "Submit malformed/blank flag strings", "HTTP 400 Bad Request", "HTTP 400 returned cleanly", "PASS"],
        ["TC-05", "Solve Validation", "Submit correct Stage 1 clue ('K0X-17')", "HTTP 200, +150 XP, unlocks Stage 2", "Stage 1 marked solved, Stage 2 opened", "PASS"],
        ["TC-06", "Payload Bridge", "Solve Stage 4 and verify Stage 5 bridge", "Ciphertext forwarded to Stage 5 session", "Stage 5 pre-loads recovered FTP stream", "PASS"],
        ["TC-07", "Capstone Creds", "SSH into 47.129.24.175:2222 with Stage 1+5 creds", "Successful shell login for user K0X-17", "Shell prompt received, zero privilege escalation", "PASS"],
        ["TC-08", "Unintended Check", "Run 'binwalk' / 'strings' on hero-banner.jpg", "No plaintext flag revealed", "Payload fully concealed in DCT coefficients", "PASS"],
        ["TC-09", "Platform Reset", "Trigger POST /api/ctf/reset", "All stages re-locked, points reset to 0", "Full clean state restored immediately", "PASS"],
        ["TC-10", "Network Isolation", "Scan AWS EC2 instance for unexpected ports", "Only port 2222 responds; ports 22, 80 closed", "Strict security group boundary verified", "PASS"]
    ]

    t_tc = doc.add_table(rows=len(test_cases), cols=6)
    t_tc.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r_idx, row in enumerate(test_cases):
        for c_idx, val in enumerate(row):
            cell = t_tc.cell(r_idx, c_idx)
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
                set_cell_background(cell, "F2F4F7" if r_idx % 2 == 1 else "FFFFFF")
                p.runs[0].font.size = Pt(8)
                if c_idx == 5:
                    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                    p.runs[0].font.bold = True
                    p.runs[0].font.color.rgb = RGBColor(0x1B, 0x5E, 0x20)
            set_cell_margins(cell, top=50, bottom=50, left=60, right=60)

    # 3.2 Defects Found and Fixed
    add_heading_styled(doc, "3.2 Defects Found and Fixed During Implementation (Bug Log)", 2)
    defects = [
        ["Defect ID", "Severity", "Defect Description", "Root Cause Analysis", "Engineering Fix Implemented"],
        ["DEF-01", "High", "Client-Side Flag Leak: Flags visible in JavaScript bundle", "Initial prototype evaluated flags in React state.", "Migrated all validation to Express backend (ctf.controller.js). Frontend receives only boolean success."],
        ["DEF-02", "High", "State Desync on Browser Reload", "React state reset on F5, wiping unlocked stages.", "Added JWT authentication and /progress rehydration endpoint that fetches userStore state on mount."],
        ["DEF-03", "Medium", "Unintended Stego Shortcut via Strings Utility", "Initial carrier image had comments appended as plain ASCII.", "Re-encoded carrier using Steghide with AES encryption embedded directly in JPEG DCT frequencies."],
        ["DEF-04", "Medium", "SSH Brute-Force Exposure on Cloud Target", "EC2 instance received automated SSH scans on port 22.", "Relocated SSH daemon to non-standard port 2222, enforced fail2ban, and created an isolated unprivileged user."],
        ["DEF-05", "Low", "Whitespace & Letter Case Flag Rejections", "Users accidentally pasting trailing spaces failed validation.", "Applied .trim() and normalized string comparison in ctf.controller.js."]
    ]
    t_def = doc.add_table(rows=len(defects), cols=5)
    t_def.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r_idx, row in enumerate(defects):
        for c_idx, val in enumerate(row):
            cell = t_def.cell(r_idx, c_idx)
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

    # 3.3 Unintended Solution Checks
    add_heading_styled(doc, "3.3 Unintended-Solution Verification (Bypass Prevention)", 2)
    p = doc.add_paragraph()
    p.add_run("To ensure academic rigor and prevent trivial bypasses (Requirement 7), the following checks were validated:")
    unintended = [
        ("Steganography (Stage 2): ", "Verified that running 'binwalk -e' or 'foremost' outputs 0 extracted files. The data is mathematically distributed across DCT frequency coefficients and cannot be carved using header signatures."),
        ("Network Forensics (Stage 4): ", "Verified that viewing PCAP packet summaries in Wireshark does not reveal the payload. The operative must specifically isolate and follow TCP Port 20 (FTP-DATA) to reconstruct the fragmented stream."),
        ("Cryptographic Decryption (Stage 5): ", "Verified that frequency analysis fails due to the polyalphabetic nature of the Vigenère cipher. Decryption strictly requires deriving the 9-letter keyword 'WAREHOUSE'."),
        ("Capstone Target (Stage 6): ", "The user 'K0X-17' has restricted permissions (/bin/bash, no sudo, read-only on /opt/stage6). Privilege escalation cannot be used to read flags; the genuine LSB + XOR path must be executed.")
    ]
    for ut, ud in unintended:
        bp = doc.add_paragraph(style='List Bullet')
        bp.paragraph_format.space_after = Pt(2)
        r = bp.add_run(ut)
        r.bold = True
        r2 = bp.add_run(ud)

    # Section 4: Reset & Recovery + Risk Register
    add_heading_styled(doc, "4. Reset / Recovery Test & Risk Register Outcomes", 1)
    
    add_heading_styled(doc, "4.1 Platform Reset & Recovery Mechanism", 2)
    p = doc.add_paragraph()
    p.add_run("A critical requirement of Assignment 02 is demonstrating that the play box can be restored to a clean initial state without manual intervention. Kernel0X implements a two-tier recovery mechanism:")
    
    bp1 = doc.add_paragraph(style='List Bullet')
    bp1.add_run("Application-Level Reset: ").bold = True
    bp1.add_run("Calling the POST /api/ctf/reset endpoint resets solvedStages to an empty array, restores points to 0, resets stageTimes, and relocks stages 2 through 6. The UI immediately transitions back to Stage 1, ready for a new operative.")
    
    bp2 = doc.add_paragraph(style='List Bullet')
    bp2.add_run("Infrastructure-Level Recovery: ").bold = True
    bp2.add_run("In the event of corrupted system state or container tampering, the environment can be fully rebuilt in seconds using Docker Compose volume purges: 'docker-compose down -v && docker-compose up -d --build'. On the AWS EC2 instance, dotfiles and artifacts are restored via an immutable template script.")

    add_heading_styled(doc, "4.2 Risk Register & Security Controls Evaluation", 2)
    risks = [
        ["Risk ID", "Identified Risk Event", "Pre-Mitigation (L / I)", "Applied Mitigation Strategy & Security Controls", "Post-Mitigation Outcome"],
        ["RSK-01", "Accidental Exposure to University Network", "Medium / Critical", "AWS EC2 instance placed in isolated VPC; Security Group strictly restricts traffic. No route to SLIIT internal networks.", "Zero institutional exposure. Sandboxed cloud environment."],
        ["RSK-02", "Denial of Service / Platform Crashing", "Medium / High", "Rate limiting on API endpoints (express-rate-limit). Docker resource caps (mem_limit: 512MB, cpus: 0.5).", "Platform survives stress testing and brute-force attempts."],
        ["RSK-03", "Flag Leakage via Source / History", "High / High", "No flags committed to Git repository. Environment variables and database store used for flag validation.", "Zero unauthorized discovery of solutions in repository."],
        ["RSK-04", "Privilege Escalation on Cloud Sandbox", "Medium / High", "SSH user K0X-17 created with restricted UID, no sudoers entry, read-only permissions on challenge directories.", "Operatives cannot compromise host machine or alter files."]
    ]
    t_rsk = doc.add_table(rows=len(risks), cols=5)
    t_rsk.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r_idx, row in enumerate(risks):
        for c_idx, val in enumerate(row):
            cell = t_rsk.cell(r_idx, c_idx)
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
                set_cell_background(cell, "F2F4F7" if r_idx % 2 == 1 else "FFFFFF")
                p.runs[0].font.size = Pt(8)
            set_cell_margins(cell, top=50, bottom=50, left=60, right=60)

    # Section 5: Assignment 01 Evolution
    add_heading_styled(doc, "5. Changes Made to Assignment 01 Design with Technical Justifications", 1)
    
    p = doc.add_paragraph()
    p.add_run("During the implementation phase, our group refined the approved Assignment 01 proposal to enhance realism, security, and pedagogical value. All changes are technically justified below:")

    changes = [
        ["Area", "Assignment 01 Approved Proposal", "Assignment 02 Implemented Reality", "Technical Justification & Academic Rationale"],
        ["Capstone Hosting", "Local simulated container on port 8080.", "Isolated AWS EC2 Linux Cloud Instance on SSH Port 2222.", "Provides realistic network latency, authentic SSH shell interaction, and total isolation from the host machine."],
        ["Inter-Stage Data Flow", "Manual copy-pasting of long raw strings across web stages.", "Automated inter-stage session bridge from Stage 4 to Stage 5.", "Eliminates frustrating typographical errors while maintaining the core challenge requirement of solving the cipher."],
        ["Scoring Engine", "Static point allocation (flat 150 points per stage).", "Dynamic time-decay model (100 Base XP + up to 100 Speed Bonus XP over 60 min).", "Encourages speed and realistic Incident Response triage behavior, rewarding efficient penetration testing."],
        ["Credential Interlinking", "Independent, unconnected flags per stage.", "Unified investigative kill-chain (Stage 1 clue + Stage 5 flag unlock Stage 6 SSH).", "Fosters an authentic narrative where reconnaissance leads directly to initial access and lateral movement."],
        ["Certificate Generation", "Simple completion text modal.", "Dedicated /thank-you page with printable cryptographic Certificate of Excellence.", "Provides tangible learning verification with verifiable SHA-256 integrity hash."]
    ]
    t_chg = doc.add_table(rows=len(changes), cols=4)
    t_chg.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r_idx, row in enumerate(changes):
        for c_idx, val in enumerate(row):
            cell = t_chg.cell(r_idx, c_idx)
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

    # Section 6: Member 4 Self-Developed Script
    add_heading_styled(doc, "6. Member 4 Self-Developed Verification Suite (LO3 Compliance)", 1)
    
    p = doc.add_paragraph()
    p.add_run("To satisfy Learning Outcome 3 (LO3: Develop exploitation code to facilitate penetration testing), Member 4 engineered a custom automated Python verification suite: ").font.size = Pt(10.5)
    r_c = p.add_run("verify_e2e_pipeline.py")
    r_c.bold = True
    p.add_run(". This script programmatically audits API health, simulates operative registration, asserts anti-cheat boundary locks, validates sequential flag progression across all 6 stages, verifies the reset engine, and performs socket-level security isolation checks.")

    code_sample = """# verify_e2e_pipeline.py (Snippet executed live on camera)
import sys, time, socket, json, urllib.request

BASE_URL = "http://localhost:5000/api"
EC2_HOST = "47.129.24.175"
EC2_PORT = 2222

def run_e2e_suite():
    # 1. Gateway Health Check
    code, res = http_get("/health")
    log_test("TC-01", "Backend Gateway Health & Liveness Audit", code == 200)

    # 2. Automated Operative Registration & JWT Issuance
    token = register_test_user()
    
    # 3. Anti-Cheat Sequential Lock (Stage 2 jump blocked before Stage 1)
    code, _ = http_post("/ctf/submit", {"stage": "stage2", "flag": "Rlyuls0E..."}, token)
    log_test("TC-03", "Sequential Dependency Lock", code == 403) # 403 Forbidden = PASS!

    # 4-10. Sequential Flag Progression (Stages 1 through 6)
    solve_all_stages(token)

    # 11. State Reset & Recovery Verification
    code, res = http_post("/ctf/reset", {}, token)
    log_test("TC-11", "Platform Recovery: Full Reset & State Purge", len(res.get("solvedStages")) == 0)

    # 12. Security Isolation Audit (AWS Port 2222 Liveness Check)
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(3.0)
    conn = s.connect_ex((EC2_HOST, EC2_PORT))
    log_test("TC-12", "Security Isolation: AWS EC2 Port 2222", conn == 0)"""

    add_code_block(doc, code_sample)

    # Section 7: Spoken Script & Screen Actions
    add_heading_styled(doc, "7. Member 4 Spoken Presentation Script & Live Screen Actions", 1)
    
    p = doc.add_paragraph()
    p.add_run("Below is the exact word-for-word spoken presentation script. Member 4 can either present this in a dedicated ~4-minute block or split it as the Opening Architecture + Closing Testing/Reset wrap-up.")

    script_blocks = [
        ("00:00 – 00:45", "Introduction, Role Definition & Architecture Overview",
         "ACTION ON SCREEN: Webcam full screen or PIP with Student ID visible. Switch screen share to browser showing Kernel0X dashboard and system architecture diagram.",
         "Good day, everyone. My name is [Your Name], Student ID [Your IT Number]. I am the Integration, Testing, and Documentation Lead for our CTF Play Box: Kernel0X Breach Investigation. My role in this project was to architect the end-to-end challenge dependencies, build the automated verification suite, validate our security isolation controls, and ensure reliable recovery mechanisms. Kernel0X models a realistic breach investigation at NexaLabs. It connects six chained stages across five cybersecurity domains: OSINT, Steganography, Classical Cryptography, Network Traffic Forensics, and Live Cloud Target Exploitation."),

        ("00:45 – 01:30", "End-to-End Progression & Flag Dependency Chain",
         "ACTION ON SCREEN: Point cursor at Stage 1 through 6 dependency diagram in the portal. Show how clues pass between stages.",
         "Let us examine how our stages interconnect into an authentic investigation. Stage 1 produces clue K0X-17 via EXIF metadata. This code is not just an arbitrary string: it becomes the decryption passphrase for Steghide in Stage 2, provides the shift offset of seven for our Caesar cipher in Stage 3, and serves as the SSH username for our Capstone in Stage 6. Furthermore, the network capture analyzed in Stage 4 uncovers the hostname ftp.warehouse9.nexalabs.local, which gives the operative the keyword WAREHOUSE to decrypt the Vigenère cipher in Stage 5. That Stage 5 flag directly becomes the SSH password to access Stage 6 on AWS. Every stage is mathematically and contextually chained."),

        ("01:30 – 02:45", "Automated E2E Testing Suite & Unintended Solution Checks (LO3)",
         "ACTION ON SCREEN: Switch to terminal. Show verify_e2e_pipeline.py. Run command: 'python verify_e2e_pipeline.py'. Show green PASS checkmarks appearing on screen.",
         "To satisfy Learning Outcome 3, I developed an automated End-to-End integration test suite in Python: verify_e2e_pipeline.py. Running this script live against our backend gateway, notice how it validates twelve comprehensive test cases. First, in TC-03, it asserts anti-cheat protection: when the script attempts to submit a Stage 2 flag before solving Stage 1, the server strictly returns HTTP 403 Forbidden. Next, it validates all sequential flags from Stage 1 through 6, verifying our dynamic XP scoring engine. Importantly, we verified unintended-solution barriers: in Stage 2, running binwalk or strings fails because the payload is embedded inside JPEG Discrete Cosine Transform coefficients. In Stage 6, our cloud user K0X-17 has no sudo privileges, forcing the operative to use the intended LSB and XOR decryption pathway."),

        ("02:45 – 03:30", "Platform Reset / Recovery & Risk Register Outcomes",
         "ACTION ON SCREEN: Switch browser to CTF portal. Click the [ RESET ] button. Show stages 2-6 locking back and points resetting to 0. Show risk register slide or document.",
         "Next, we demonstrate our recovery and reset mechanism. Clicking the Reset button sends a POST request to /api/ctf/reset. As you can see, all stages immediately lock, operative points reset to zero, and the timer restarts, allowing another participant to play without residual artifacts. In terms of our Risk Register: our primary risk was accidental exposure to university networks. We mitigated this by isolating our Capstone environment in a dedicated AWS VPC, exposing strictly SSH port 2222 and blocking all internal institutional subnets. Denial-of-service risks were mitigated using Express rate-limiting and Docker resource quotas."),

        ("03:30 – 04:15", "Technical Design Changes from Assignment 01 & Conclusion",
         "ACTION ON SCREEN: Display the Assignment 01 vs Assignment 02 Comparison Matrix.",
         "Finally, we highlight three major improvements from our Assignment 01 proposal: First, we migrated Stage 6 from a local mock service to a live AWS EC2 Linux sandbox on port 2222, providing real latency and authentic terminal forensics. Second, we engineered an automated session bridge from Stage 4 to Stage 5, eliminating copy-paste errors while preserving cryptographic problem-solving. Third, we upgraded from static points to a dynamic time-decay XP scoring model that simulates real incident triage. In conclusion, our platform is fully functional, highly secure, repeatable, and rigorously tested. Thank you.")
    ]

    for timing, title, action, spoken in script_blocks:
        add_heading_styled(doc, f"[{timing}] {title}", 2)
        p_act = doc.add_paragraph()
        p_act.paragraph_format.space_before = Pt(2)
        p_act.paragraph_format.space_after = Pt(2)
        r_a = p_act.add_run("SCREEN ACTION: ")
        r_a.bold = True
        r_a.font.color.rgb = RGBColor(0xB2, 0x22, 0x22)
        r_at = p_act.add_run(action.replace("ACTION ON SCREEN: ", ""))
        r_at.font.italic = True

        p_spk = doc.add_paragraph()
        p_spk.paragraph_format.space_before = Pt(2)
        p_spk.paragraph_format.space_after = Pt(6)
        r_s = p_spk.add_run("SPOKEN SCRIPT: ")
        r_s.bold = True
        r_s.font.color.rgb = RGBColor(0x00, 0x33, 0x66)
        r_st = p_spk.add_run(spoken)

    # Section 8: Lecturer Viva Q&A Cheat Sheet
    add_heading_styled(doc, "8. Lecturer Viva Q&A Preparation Cheat Sheet for Member 4", 1)
    
    qas = [
        ("Q1: How did you prevent students from bypassing Stage 1 and solving Stage 2 directly?",
         "Answer: In ctf.controller.js, our submitFlag handler checks the user's solvedStages array in userStore. If 'stage1' is not present, the request is rejected with HTTP 403 Forbidden. Additionally, Stage 2's Steghide carrier cannot be extracted without the passphrase 'K0X-17', which is only obtainable from Stage 1's EXIF metadata."),
        
        ("Q2: What was the most critical defect you discovered during testing and how did you resolve it?",
         "Answer: In our initial prototype, flag evaluation was performed in the frontend React bundle, meaning an attacker could open DevTools and read the plaintext flags. I resolved this by moving 100% of the validation logic to the Express backend. The frontend now only receives a boolean success indicator and the next unlocked stage."),
        
        ("Q3: How does your reset mechanism guarantee a clean state for the next user?",
         "Answer: Our reset endpoint wipes the operative's solvedStages array, zeroes the XP score, resets the stage timer, and re-locks stages 2 through 6 in the database. For infrastructure recovery, our Docker Compose setup uses ephemeral volumes that can be wiped cleanly with 'docker-compose down -v'."),
        
        ("Q4: Why did you move Stage 6 to an AWS EC2 instance instead of running it locally as originally proposed in Assignment 01?",
         "Answer: A local container shares host kernel resources and network namespaces. Moving Stage 6 to an isolated AWS EC2 instance on custom port 2222 provided authentic network isolation, prevented accidental access to host systems, and provided students with a genuine remote SSH incident response experience."),
        
        ("Q5: What script did you author to satisfy LO3?",
         "Answer: I authored 'verify_e2e_pipeline.py', an automated Python verification and integration testing suite. It programmatically executes 12 end-to-end test cases against our live API, validating authentication, sequential dependency locks, input fuzzing, full flag progression, platform recovery, and socket connectivity.")
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

    # Output path
    out_path = r"c:\Users\Muditha\Desktop\Kernel0x\Member_4_Integration_Testing_Complete_Guide.docx"
    try:
        doc.save(out_path)
        print(f"[+] Successfully generated Word document at: {out_path}")
    except PermissionError:
        alt_path = r"c:\Users\Muditha\Desktop\Kernel0x\Member_4_Integration_Testing_Complete_Guide_v2.docx"
        doc.save(alt_path)
        print(f"[+] Successfully generated Word document at alternate path: {alt_path}")

if __name__ == "__main__":
    build_member4_doc()
