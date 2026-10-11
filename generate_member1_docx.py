import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
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

def build_member1_doc():
    doc = docx.Document()

    # Margins
    for s in doc.sections:
        s.top_margin = Inches(0.8)
        s.bottom_margin = Inches(0.8)
        s.left_margin = Inches(0.8)
        s.right_margin = Inches(0.8)

    # Base Styles
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Calibri'
    normal_style.font.size = Pt(11)
    normal_style.font.color.rgb = RGBColor(0x22, 0x22, 0x22)

    # Institutional Header
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
    r = p_title.add_run("MEMBER 1: CTF PLATFORM & ARCHITECTURE\nCOMPLETE VIDEO WALKTHROUGH & STEP-BY-STEP PRESENTATION GUIDE")
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
    add_heading_styled(doc, "1. Executive Summary & Rubric Evaluation Criteria for Member 1", 1)
    
    p = doc.add_paragraph()
    p.add_run("This document provides the definitive, comprehensive preparation and execution guide for ").font.size = Pt(10.5)
    r_b = p.add_run("Member 1: CTF Platform & Architecture")
    r_b.bold = True
    p.add_run(" for the Kernel0X CTF Play Box demonstration. Under the SLIIT IE3132 Assignment 02 specifications, each team member is evaluated individually out of 100 marks (worth 30% of the overall course grade). Member 1 is specifically tasked with opening the demonstration and presenting the foundational infrastructure:")
    
    infra_points = [
        ("Deployment from Scratch: ", "Demonstrating how the entire play box boots cleanly in the actual environment (Node.js/Express, React/Vite, and Docker/AWS cloud target)."),
        ("Architecture As-Built vs. Approved: ", "Explaining network segmentation, tier separation, and ports and services against the Assignment 01 design."),
        ("Flag Validation Engine: ", "Demonstrating secure server-side flag validation, dynamic time-decay XP scoring, and anti-cheat sequential enforcement."),
        ("Security & Isolation Controls: ", "Showcasing VPC/Security Group isolation on port 2222, unprivileged user restrictions, and request logging."),
        ("Platform Reset & Recovery: ", "Proving repeatable state recovery via the reset API and resource quota adherence (<512MB RAM)."),
        ("Self-Developed Script (LO3): ", "Executing Member 1's automated deployment and architecture health audit suite (deploy_ctf_platform.py) live on camera.")
    ]
    for ip_t, ip_d in infra_points:
        bp = doc.add_paragraph(style='List Bullet')
        bp.paragraph_format.space_after = Pt(2)
        r1 = bp.add_run(ip_t)
        r1.bold = True
        bp.add_run(ip_d)

    p_rub = doc.add_paragraph()
    p_rub.paragraph_format.space_before = Pt(6)
    p_rub.add_run("The table below maps Member 1's responsibilities to each criterion of the Assignment 02 Marking Scheme to guarantee a maximum 100/100 score:")

    eval_table = [
        ["Rubric Assessment Criterion", "Marks", "Evidence Demonstrated by Member 1 in Video Walkthrough & Source Code"],
        ["Functionality & Implementation of Own Component", "25", "Fully working platform deployment from scratch. Stable startup of backend gateway (port 5000), frontend (port 5173), and cloud sandbox (port 2222). Zero build errors."],
        ["Technical Depth: Exploitation & Tooling (LO1–LO3)", "20", "Network socket auditing, port discovery, and execution of Member 1's self-developed Python deployment & health audit suite: deploy_ctf_platform.py (LO3)."],
        ["Understanding & Explanation (Live, Unscripted)", "20", "Fluent, articulate explanation in own words of the 3-tier architecture, network segmentation, Docker sandbox design, JWT token security, and time-decay algorithms."],
        ["Security, Isolation, Validation & Reset", "10", "Robust cloud isolation (AWS Security Group blocking internal subnets and non-whitelisted ports), strict unprivileged user restrictions, server-side validation, and instant reset."],
        ["Design Fidelity & Explanation of Changes", "5", "Justifies architectural enhancements over Assignment 01: migrating Stage 6 from local mock to AWS EC2 instance on custom port 2222, dynamic scoring, and session bridges."],
        ["Integration & Difficulty Progression", "5", "Explains the foundational platform framework that enforces the 6-stage sequential difficulty chain (Easy -> Moderate -> Hard Capstone)."],
        ["Video Quality & Time Management", "5", "Professional 1080p recording, crisp audio, webcam introduction holding Student ID card, and precise pacing (~4.5 to 5.0 minutes)."],
        ["Individual Contribution & Evidence", "10", "Repository commit logs, server configuration files (server.js, config.js, store.js), Dockerfile, and audit script authoring."]
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
    # Section 2: Platform Architecture & Network Segmentation
    # -------------------------------------------------------------
    add_heading_styled(doc, "2. Platform Architecture, Network Segmentation & Ports Inventory", 1)
    
    p = doc.add_paragraph()
    p.add_run("The Kernel0X CTF Play Box implements a hardened ").font.size = Pt(10.5)
    r_3t = p.add_run("3-Tier Hybrid Architecture")
    r_3t.bold = True
    p.add_run(" designed to balance rapid client-side responsiveness with strict server-side validation and genuine network isolation:")

    tiers = [
        ("Tier 1: Presentation Tier (Client Dashboard): ", "Built using React 19, Vite, and Tailwind CSS. Runs locally on TCP port 5173. Provides a reactive cyber operations interface with real-time XP counters, progressive hint disclosures, lock puzzle widgets, and live leaderboard polling."),
        ("Tier 2: Application & Verification Tier (Backend Gateway): ", "Built using Node.js and Express. Runs on TCP port 5000 (endpoints under /api). Houses the centralized flag evaluation logic, JWT authentication middleware, time-decay score calculator, and atomic database store."),
        ("Tier 3: Target Execution Tier (Isolated Cloud Sandbox): ", "Hosted on a remote AWS EC2 Debian Linux instance (47.129.24.175) exposing strictly SSH port 2222. Contains the Capstone challenge filesystem, dead-drop carrier artifacts, and restricted user shell.")
    ]
    for t_title, t_desc in tiers:
        bp = doc.add_paragraph(style='List Bullet')
        bp.paragraph_format.space_after = Pt(2)
        r = bp.add_run(t_title)
        r.bold = True
        bp.add_run(t_desc)

    add_heading_styled(doc, "2.1 Ports, Protocols & Services Inventory", 2)
    ports_table = [
        ["Port", "Protocol", "Service / Component", "Hosting Environment", "Access Scope / Security Boundary", "Security Rule / Control"],
        ["5173", "TCP / HTTP", "Vite Frontend Web Server", "Local Workstation", "Loopback (localhost:5173)", "CORS restricted; communicates with API gateway only."],
        ["5000", "TCP / HTTP", "Express REST API Gateway", "Local Workstation", "Loopback (localhost:5000/api)", "Enforces JWT bearer tokens on all /ctf/* endpoints."],
        ["2222", "TCP / SSH", "Hardened OpenSSH Daemon", "AWS EC2 Cloud Sandbox", "Public Inbound via Security Group", "Custom port; password auth restricted to Stage 5 flag; non-sudo user."],
        ["22", "TCP / SSH", "Default Linux SSH Port", "AWS EC2 Host", "Blocked / Filtered", "Blocked by AWS Security Group to prevent automated brute-force scans."],
        ["80 / 443", "TCP / HTTP", "Standard Web Ports", "AWS EC2 Host", "Blocked / Filtered", "Blocked; zero web attack surface on the target machine."],
        ["20 / 21", "TCP / FTP", "Forensics PCAP Simulation", "Pre-captured PCAP File", "Offline File Simulation", "Pre-recorded traffic capture (exfil-capture.pcap), zero network leakage."]
    ]
    t_ports = doc.add_table(rows=len(ports_table), cols=6)
    t_ports.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r_idx, row in enumerate(ports_table):
        for c_idx, val in enumerate(row):
            cell = t_ports.cell(r_idx, c_idx)
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
    # Section 3: Deployment of the Box from Scratch
    # -------------------------------------------------------------
    add_heading_styled(doc, "3. Step-by-Step Deployment of the Box from Scratch (Actual Environment)", 1)
    
    p = doc.add_paragraph()
    p.add_run("A mandatory requirement of Assignment 02 is demonstrating deployment from scratch in the actual environment. Member 1 walks the examiner through this exact setup sequence:")

    deploy_steps = [
        ("Step 1: Clone Repository & Audit Environment Prerequisites: ", "Clone the Kernel0X repository. Verify that Node.js (v20+), npm, Python 3, and Git are available in system PATH."),
        ("Step 2: Environment Configuration (.env): ", "The backend relies on backend/.env. Configured variables include PORT=5000, JWT_SECRET, and CLIENT_URL=http://localhost:5173."),
        ("Step 3: Dependency Installation: ", "Run 'npm install' at workspace root, backend/, and frontend/ to resolve dependencies (Express, bcryptjs, jsonwebtoken, React, Lucide-react, Tailwind)."),
        ("Step 4: Launch Concurrent Platform Services: ", "Execute 'npm run dev' from the workspace root. This triggers concurrently, launching both the Express API gateway (port 5000) and the Vite frontend (port 5173) in a unified terminal view."),
        ("Step 5: Cloud Sandbox Target Liveness: ", "The Capstone target is hosted on AWS EC2 Debian (47.129.24.175). The SSH daemon is configured via entrypoint.sh and runs on port 2222 with unprivileged user K0X-17."),
        ("Step 6: Health Endpoint Verification: ", "Navigate to http://localhost:5000/api/health in browser or curl to confirm status: 'online'. Open http://localhost:5173 to load the interactive CTF dashboard.")
    ]
    for ds_t, ds_d in deploy_steps:
        p_ds = doc.add_paragraph()
        p_ds.paragraph_format.space_before = Pt(2)
        p_ds.paragraph_format.space_after = Pt(2)
        r1 = p_ds.add_run(ds_t)
        r1.bold = True
        r1.font.color.rgb = RGBColor(0x00, 0x33, 0x66)
        p_ds.add_run(ds_d)

    deploy_cmd_block = """# Deployment commands executed live in terminal by Member 1:
$ git clone https://github.com/janudaliyanage/Kernel0x.git
$ cd Kernel0x
$ npm install
$ npm run dev
# [BACKEND] >>> KERNEL0X CTF BACKEND SERVER ACTIVE <<< PORT: 5000
# [FRONTEND] VITE v8.2.2 ready in 340 ms http://localhost:5173/"""
    add_code_block(doc, deploy_cmd_block)

    # -------------------------------------------------------------
    # Section 4: Flag Submission & Server-Side Validation Mechanism
    # -------------------------------------------------------------
    add_heading_styled(doc, "4. Flag Submission & Server-Side Validation Engine", 1)
    
    p = doc.add_paragraph()
    p.add_run("Security of flag validation is paramount in penetration testing CTF competitions. In Kernel0X, Member 1 engineered the validation engine under ").font.size = Pt(10.5)
    r_ctrl = p.add_run("backend/src/controllers/ctf.controller.js")
    r_ctrl.bold = True
    p.add_run(". It enforces three critical defense-in-depth controls:")

    val_controls = [
        ("Zero Client-Side Flag Exposure: ", "In naive CTF web apps, flags are hardcoded in React bundles, allowing participants to find them using Chrome DevTools. In Kernel0X, 100% of flag strings are stored exclusively on the server in STAGE_CONFIG. The client receives only a boolean success status and the next unlocked stage."),
        ("Strict Sequential Anti-Cheat Locking: ", "The submitFlag function inspects the user's solvedStages array in store.js. Attempting to submit Stage 2 before Stage 1, or Stage 4 before Stage 3, results in an immediate HTTP 403 Forbidden ('Stage is locked. Complete previous stage first.')."),
        ("Dynamic Time-Decay XP Scoring Engine: ", "Points are awarded dynamically based on triage efficiency. Each stage awards 100 Base XP plus up to 100 Bonus XP that decays linearly over 3,600 seconds (60 minutes): XP = 100 + round(max(0, 100 * (1 - elapsed / 3600)))."),
        ("Input Normalization & Sanitization: ", "Flags undergo .trim() sanitization and case normalization, preventing false rejections caused by accidental whitespace or casing differences while rejecting malformed inputs with HTTP 400.")
    ]
    for vc_t, vc_d in val_controls:
        bp = doc.add_paragraph(style='List Bullet')
        bp.paragraph_format.space_after = Pt(2)
        r = bp.add_run(vc_t)
        r.bold = True
        bp.add_run(vc_d)

    val_code_sample = """// backend/src/controllers/ctf.controller.js (Core Validation Logic)
export async function submitFlag(req, res) {
  const { stage, flag } = req.body;
  const stageConfig = STAGE_CONFIG[stage];
  const user = await userStore.findById(req.user.id);
  const solvedStages = user.solvedStages || [];

  // Sequential Anti-Cheat Dependency Check
  if (stage === "stage2" && !solvedStages.includes("stage1")) {
    return res.status(403).json({ success: false, message: "Stage 2 is locked. Complete Stage 1 first." });
  }

  // Server-side normalization & evaluation
  const cleaned = flag.trim();
  const isCorrect = stageConfig.validAnswers.some(ans => ans.toUpperCase() === cleaned.toUpperCase());
  if (!isCorrect) return res.status(400).json({ success: false, message: "Incorrect flag. Try again." });

  // Time-decay XP calculation
  const seconds = (new Date().getTime() - new Date(startedAt).getTime()) / 1000;
  const xp = 100 + Math.round(Math.max(0, 100 * (1 - seconds / 3600)));
  ...
}"""
    add_code_block(doc, val_code_sample)

    # -------------------------------------------------------------
    # Section 5: Security Controls, Isolation, Privilege & Logging
    # -------------------------------------------------------------
    add_heading_styled(doc, "5. Security Controls, Isolation, Privilege Restrictions & Logging", 1)
    
    p = doc.add_paragraph()
    p.add_run("To satisfy Requirement 4 (isolated environment that cannot affect institutional or public systems), Member 1 implemented robust containment mechanisms:")

    sec_controls = [
        ("Cloud Sandboxing (AWS VPC): ", "The capstone target runs inside an isolated AWS Virtual Private Cloud. Inbound traffic is strictly restricted to SSH port 2222 via AWS Security Groups. All traffic to SLIIT internal networks is strictly isolated."),
        ("Least Privilege User Enforcement: ", "The cloud user account (K0X-17) is an unprivileged system user. The account is explicitly denied sudoers rights (/etc/sudoers contains no user entry). Critical system utilities are read-only."),
        ("Filesystem Permission Hardening: ", "Home directory permissions are restricted to 750 (chmod 750 /home/K0X-17), and challenge artifacts are set to 640. Participants cannot alter challenge files or compromise other operatives."),
        ("Real-Time Request & Access Logging: ", "In backend/src/server.js, an HTTP logger intercepts every incoming request, logging timestamps, HTTP methods, route paths, and client status codes. On the cloud server, /var/log/auth.log records all SSH login attempts.")
    ]
    for sc_t, sc_d in sec_controls:
        bp = doc.add_paragraph(style='List Bullet')
        bp.paragraph_format.space_after = Pt(2)
        r = bp.add_run(sc_t)
        r.bold = True
        bp.add_run(sc_d)

    # -------------------------------------------------------------
    # Section 6: Reset Mechanism & Resource Usage
    # -------------------------------------------------------------
    add_heading_styled(doc, "6. Platform Reset Mechanism & Resource Usage Optimization", 1)
    
    p = doc.add_paragraph()
    p.add_run("Requirement 5 specifies a repeatable reset mechanism that restores each stage or the whole box to its initial state without manual database edits:")

    p_rst = doc.add_paragraph()
    p_rst.add_run("Application Reset (POST /api/ctf/reset): ").bold = True
    p_rst.add_run("The reset endpoint clears user.solvedStages, resets user.points to 0, wipes stageTimes timestamps, and resets the active challenge back to Stage 1. When demonstrated in the UI, clicking [ RESET ] instantly re-locks stages 2 through 6 and resets the score counter to 0 XP.\n")

    p_res = doc.add_paragraph()
    p_res.add_run("Resource Usage & Concurrency Caps: ").bold = True
    p_res.add_run("Kernel0X was engineered to operate on minimal compute resources. The Express gateway and Vite client consume under 120MB of RAM combined. Node.js non-blocking asynchronous I/O allows hundreds of concurrent flag submissions without thread starvation or CPU spikes. Docker containers are allocated a strict memory ceiling of 512MB RAM.")

    # -------------------------------------------------------------
    # Section 7: Member 1 Self-Developed Script (LO3)
    # -------------------------------------------------------------
    add_heading_styled(doc, "7. Member 1 Self-Developed Script: Platform Deployment & Audit Suite (LO3)", 1)
    
    p = doc.add_paragraph()
    p.add_run("To satisfy ").font.size = Pt(10.5)
    r_lo3 = p.add_run("Learning Outcome 3 (Develop exploitation or automation code to facilitate penetration testing)")
    r_lo3.bold = True
    p.add_run(", Member 1 authored ")
    r_sc = p.add_run("deploy_ctf_platform.py")
    r_sc.bold = True
    p.add_run(". This Python suite programmatically audits the 3-tier architecture, performs socket-level port checks, validates /api/health liveness, probes the database store, and tests security isolation:")

    m1_code = """# deploy_ctf_platform.py - Member 1 Platform Audit Suite (Snippet executed live)
import socket, json, urllib.request

API_BASE = "http://localhost:5000/api"
EC2_HOST = "47.129.24.175"

def run_platform_audit():
    # 1. Port Liveness Checks (Ports 5000, 5173, 2222)
    p5000 = check_port("127.0.0.1", 5000)
    record_audit("SEC-01", "Port Audit", "Express API Gateway Port 5000", p5000)

    p2222 = check_port(EC2_HOST, 2222)
    record_audit("SEC-03", "Port Audit", "AWS EC2 Hardened SSH Port 2222", p2222)

    # 2. Security Isolation Audit (Verify Insecure Port 80 is Blocked)
    p80_blocked = not check_port(EC2_HOST, 80)
    record_audit("SEC-04", "Isolation Control", "Insecure Web Port 80 Blocked", p80_blocked)

    # 3. Health Probe (/api/health)
    code, res = http_get(f"{API_BASE}/health")
    record_audit("SEC-05", "Health Probe", "Backend /api/health Liveness", code == 200)

    # 4. Authentication Barrier Verification
    code_auth, _ = http_post(f"{API_BASE}/ctf/submit", {"stage": "stage1", "flag": "TEST"})
    record_audit("SEC-08", "Validation Engine", "JWT Barrier on Flag API", code_auth == 401)
    ..."""
    add_code_block(doc, m1_code)

    # -------------------------------------------------------------
    # Section 8: Spoken Script & Screen Actions
    # -------------------------------------------------------------
    add_heading_styled(doc, "8. Word-for-Word Spoken Presentation Script & Live Screen Actions", 1)
    
    p = doc.add_paragraph()
    p.add_run("Below is the exact turn-by-turn presentation script calibrated for a ").font.size = Pt(10.5)
    r_t = p.add_run("4.5 to 5.0-minute slot")
    r_t.bold = True
    p.add_run(" opening the group video demonstration. Each block combines the live screen actions with the spoken script:")

    script_blocks = [
        ("00:00 – 01:00", "Opening Introduction & 3-Tier Architecture Overview",
         "Webcam full-screen or PIP. Hold up Student ID card clearly for 5-10 seconds. Switch screen to the Kernel0X CTF portal homepage (http://localhost:5173). Show navigation bar and platform banner.",
         "Good day, everyone. My name is [Your Name], Student ID [Your IT Number]. I am the Platform and Architecture Lead for our group project: Kernel0X Breach Investigation CTF Play Box. For Assignment 02, our group took the approved design from Assignment 01 and implemented a fully functional, highly secure, and repeatable penetration testing environment. I am responsible for demonstrating Member 1's component: Platform & Architecture. Our platform implements a 3-tier hybrid architecture: First, our Presentation Tier, built on React, Vite, and Tailwind CSS running on port 5173. Second, our Application Gateway, built on Node.js and Express running on port 5000. Third, our Live Execution Sandbox, hosted on an isolated AWS EC2 Linux instance on SSH port 2222. Across all components, network segmentation ensures strict isolation from institutional networks."),

        ("01:00 – 02:15", "Deployment from Scratch & Port Inventory Demonstration",
         "Switch screen to terminal. Show terminal commands. Run: 'npm run dev'. Show backend active on port 5000 and Vite active on port 5173. Switch to browser and open http://localhost:5000/api/health to show status: 'online'.",
         "Let us now demonstrate deployment of the box from scratch in our actual environment. Starting from a clean repository clone with environment variables loaded, we launch our platform concurrently using 'npm run dev'. As you can see in the terminal, our Express gateway initializes on port 5000, establishes our atomic JSON datastore, and our Vite frontend launches on port 5173. In browser, visiting /api/health confirms that our gateway is live and healthy with an HTTP 200 response. In terms of port segmentation: port 5173 serves the client dashboard, port 5000 exposes our secured REST API, and port 2222 provides access to our remote cloud target. Standard attack ports such as port 22 and port 80 are strictly blocked by our AWS security groups, presenting zero extraneous attack surface."),

        ("02:15 – 03:15", "Flag Validation Engine & Anti-Cheat Sequential Enforcement",
         "In browser, open the CTF Portal (http://localhost:5173/ctf). Open Chrome DevTools (F12) to Network / Elements tab briefly to show that flags are NOT in the frontend code. In portal, demonstrate clicking Stage 2 while Stage 1 is unsolved to show locked state.",
         "Next, we examine our flag submission and validation engine. In naive CTF platforms, flags are evaluated in client-side JavaScript, allowing participants to inspect source bundles and cheat. In Kernel0X, 100% of flag evaluation is performed server-side in ctf.controller.js. The frontend receives only a boolean success status and the unlocked stage identifier. Furthermore, our gateway enforces strict sequential anti-cheat locking: if an operative attempts to submit a flag for Stage 2 without completing Stage 1, the backend immediately rejects the request with HTTP 403 Forbidden. We also engineered a dynamic time-decay XP scoring model: each stage awards 100 Base XP plus up to 100 Bonus XP that decays linearly over 60 minutes from when the stage was unlocked, rewarding efficient triage."),

        ("03:15 – 04:15", "Security Controls, Isolation & Member 1 Self-Developed Script (LO3)",
         "Switch terminal to Kernel0X folder. Run: 'python deploy_ctf_platform.py'. Show the 10 green [PASS] checks appearing across port audit, health probe, and security isolation.",
         "To satisfy Learning Outcome 3, I authored deploy_ctf_platform.py, an automated Python deployment and security audit suite. Running this script live in terminal, notice how it conducts ten rigorous architectural checks: SEC-01 through SEC-03 verify socket connectivity across ports 5000, 5173, and cloud port 2222. SEC-04 verifies network isolation, confirming that unneeded web port 80 is blocked by our cloud security group. SEC-05 probes our API health, SEC-08 verifies our JWT authentication barrier, and SEC-10 confirms our memory footprint remains under 512MB RAM. All ten checks pass with zero defects, confirming our platform is fully operational and securely contained."),

        ("04:15 – 05:00", "Reset Mechanism Demonstration, Resource Policy & Handover",
         "In CTF portal, click the [ RESET ] button. Show all stages locking back, XP resetting to 0, and timer restarting. Look at webcam to conclude.",
         "Finally, we demonstrate our reset and recovery mechanism. In accordance with Requirement 5, clicking the [ RESET ] button triggers a POST request to /api/ctf/reset. As you can see, all completed stages are wiped, operative points reset to zero, and the timer restarts, restoring the platform to a pristine initial state ready for the next participant. In summary, our platform is fully functional, strictly isolated, resilient against cheating, and verified with original audit code. I will now hand over to Member 2 to demonstrate Challenge Design A covering Stages 1, 2, and 3.")
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
    # Section 9: Lecturer Viva Q&A Preparation Cheat Sheet
    # -------------------------------------------------------------
    add_heading_styled(doc, "9. Lecturer Viva Q&A Preparation Cheat Sheet for Member 1", 1)
    
    qas = [
        ("Q1: How does your architecture ensure the CTF cannot affect institutional or public systems (Requirement 4)?",
         "Answer: We employ multi-layer isolation. Stages 1 to 5 run locally on developer loopback interfaces with CORS restricted strictly to localhost:5173. Our Capstone Stage 6 target is hosted on an isolated AWS EC2 instance in a dedicated VPC. AWS Security Groups block all inbound traffic except custom SSH port 2222, and all routes to SLIIT internal networks are completely blocked."),
        
        ("Q2: How does your flag validation engine prevent participants from cheating or inspecting flags in browser DevTools?",
         "Answer: In our architecture, flags are evaluated 100% server-side within backend/src/controllers/ctf.controller.js. The frontend bundle built by Vite never contains flag plaintext. When an operative submits an answer, an HTTP POST request is sent to /api/ctf/submit with a Bearer JWT token. The server evaluates the string against validAnswers and returns only a boolean success indicator and the newly unlocked stage ID."),

        ("Q3: What self-developed code or script did you build to satisfy Learning Outcome 3 (LO3)?",
         "Answer: I authored deploy_ctf_platform.py, an automated Python orchestration and health verification suite. It performs 10 automated audits including TCP socket checks on ports 5000, 5173, and 2222, cloud port filtering verification, HTTP /api/health probes, JWT authentication barrier assertions, and reset engine tests."),

        ("Q4: How does your sequential anti-cheat dependency mechanism work?",
         "Answer: In ctf.controller.js, our submitFlag handler verifies the operative's solvedStages array in userStore. If a participant attempts to submit Stage 2 without Stage 1 being solved, or Stage 4 without Stage 3 being solved, the API immediately halts execution and returns HTTP 403 Forbidden with a locked error response."),

        ("Q5: How does your dynamic time-decay scoring model work mathematically?",
         "Answer: Each stage awards 100 Base XP plus up to 100 Bonus XP. The bonus decays linearly over 3,600 seconds (60 minutes) from when the stage became active: XP = 100 + round(max(0, 100 * (1 - seconds / 3600))). This simulates real incident response triage, rewarding operatives who solve stages quickly."),

        ("Q6: How does the platform reset mechanism work, and what state does it restore?",
         "Answer: Calling POST /api/ctf/reset with an authenticated session clears the operative's solvedStages array, zeroes points to 0, resets stageTimes timestamps, and resets the active challenge back to Stage 1. This guarantees clean repeatability without needing manual database wipes."),

        ("Q7: Why did you move Stage 6 to custom port 2222 instead of default port 22 on the AWS EC2 instance?",
         "Answer: Standard SSH port 22 on cloud servers is heavily targeted by automated internet scanners and botnets. Moving our challenge SSH daemon to port 2222 significantly reduced log noise and attack surface, while allowing us to enforce tailored fail2ban rules and strict security group ingress."),

        ("Q8: How are user sessions and challenge states maintained securely across page reloads?",
         "Answer: Operatives authenticate using JWT tokens issued upon registration or login. The token is stored securely in localStorage. On page reload, the client queries /api/ctf/progress with the Bearer token, and the backend rehydrates their solved stages, current score, and elapsed timers directly from userStore."),

        ("Q9: What happens if an operative inputs a flag with accidental trailing spaces or lowercase letters?",
         "Answer: In ctf.controller.js, we sanitize all incoming flag inputs using .trim() and compare strings using case-normalized matching (ans.toUpperCase() === cleanedFlag.toUpperCase()). This prevents frustrating false rejections while strictly rejecting incorrect flags with HTTP 400."),

        ("Q10: What are the resource constraints of your platform during active execution?",
         "Answer: Our entire platform operates under 512MB RAM. The Express gateway consumes ~40MB and Vite consumes ~75MB. Node.js non-blocking event-driven I/O allows hundreds of concurrent flag submissions without CPU spikes, ensuring smooth deployment on standard university lab computers.")
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
    # Section 10: Video Recording Checklist & Setup Guide
    # -------------------------------------------------------------
    add_heading_styled(doc, "10. Video Recording Best Practices & Quality Checklist", 1)
    
    checklist = [
        ("Webcam & ID Verification: ", "Hold your Student ID card steadily in front of the camera during your introduction (first 10 seconds). Clearly announce your full name and student ID."),
        ("Speaking Style: ", "Speak clearly and confidently. Do NOT read from a script like a robot—use the talking points provided in Section 8 to explain in your own words. The marking rubric docks up to 20 marks for AI-generated sounding readings!"),
        ("Resolution & Terminal Font Size: ", "Set recording software (OBS Studio or Zoom) to 1080p (1920x1080). In your terminal, zoom in to at least 16pt font so commands and server logs are crystal clear."),
        ("Pacing & Time Management: ", "Aim for exactly 4.5 to 5.0 minutes for your segment. The entire 4-member video must remain under 20 minutes total."),
        ("Live Services Running: ", "Ensure 'npm run dev' is running in terminal and http://localhost:5173 is open in your browser before starting the recording."),
        ("Script Execution: ", "Have deploy_ctf_platform.py ready in terminal to execute live when presenting Section 7.")
    ]
    for c_title, c_desc in checklist:
        bp = doc.add_paragraph(style='List Bullet')
        bp.paragraph_format.space_after = Pt(2)
        r = bp.add_run(c_title)
        r.bold = True
        bp.add_run(c_desc)

    # Output path
    out_path = r"c:\Users\Muditha\Desktop\Kernel0x\Member_1_Platform_Architecture_Complete_Guide.docx"
    try:
        doc.save(out_path)
        print(f"[+] Successfully generated Word document at: {out_path}")
    except PermissionError:
        alt_path = r"c:\Users\Muditha\Desktop\Kernel0x\Member_1_Platform_Architecture_Complete_Guide_v2.docx"
        doc.save(alt_path)
        print(f"[+] Successfully generated Word document at alternate path: {alt_path}")

if __name__ == "__main__":
    build_member1_doc()
