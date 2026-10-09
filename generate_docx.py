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

def create_document():
    doc = docx.Document()
    
    # Page setup - 1 inch margins
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    # Base styling
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Calibri'
    normal_style.font.size = Pt(11)
    normal_style.font.color.rgb = RGBColor(0x22, 0x22, 0x22)

    # Title
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(2)
    run_inst = p_title.add_run("SRI LANKA INSTITUTE OF INFORMATION TECHNOLOGY (SLIIT)")
    run_inst.font.size = Pt(10)
    run_inst.font.bold = True
    run_inst.font.color.rgb = RGBColor(0x00, 0x33, 0x66)

    p_mod = doc.add_paragraph()
    p_mod.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_mod.paragraph_format.space_before = Pt(0)
    p_mod.paragraph_format.space_after = Pt(4)
    run_mod = p_mod.add_run("IE3132: Penetration Testing — Year 3, Semester 1 | Assignment 02")
    run_mod.font.size = Pt(12)
    run_mod.font.bold = True
    run_mod.font.color.rgb = RGBColor(0x55, 0x55, 0x55)

    p_main = doc.add_paragraph()
    p_main.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_main.paragraph_format.space_before = Pt(4)
    p_main.paragraph_format.space_after = Pt(4)
    run_main = p_main.add_run("CTF Play Box Implementation — 18-Minute Demonstration Walkthrough Script")
    run_main.font.size = Pt(18)
    run_main.font.bold = True
    run_main.font.color.rgb = RGBColor(0x00, 0x2B, 0x49)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(16)
    run_sub = p_sub.add_run("Platform: Kernel0X Breach Investigation | Target Recording Duration: 18:00 (Max 20:00)")
    run_sub.font.size = Pt(11)
    run_sub.font.italic = True
    run_sub.font.color.rgb = RGBColor(0x1B, 0x8A, 0x2E)

    doc.add_heading("1. Executive Summary & Video Walkthrough Requirements", level=1)
    
    p = doc.add_paragraph()
    p.add_run("This technical document provides the complete, turn-by-turn spoken script, screen actions, and code demonstrations for the 18-minute video walkthrough of the ").font.size = Pt(10.5)
    r_k = p.add_run("Kernel0X")
    r_k.bold = True
    p.add_run(" CTF Play Box. It strictly adheres to all requirements outlined in SLIIT IE3132 Assignment 02:")
    
    bullets = [
        ("Strict 18-Minute Target: ", "Allocates a 2-minute safety buffer below the hard 20-minute cap. Portions beyond 20 minutes are not graded."),
        ("Individual Evaluation (100 Marks): ", "All 4 members present their specific component live using their own voice, with camera and Student ID displayed."),
        ("Multi-Domain Coverage: ", "Covers 5 distinct cybersecurity domains: OSINT, Steganography, Classical Cryptography, Network Traffic Forensics, and Live System Exploitation."),
        ("Self-Developed Exploit/Solver Code (LO3): ", "Each member presents and runs their original Python/bash solver script line-by-line."),
        ("Live Unscripted Environment: ", "Recorded directly from the running browser, terminal, Wireshark, and isolated AWS EC2 Linux target.")
    ]
    for b_title, b_desc in bullets:
        bp = doc.add_paragraph(style='List Bullet')
        bp.paragraph_format.space_after = Pt(3)
        r = bp.add_run(b_title)
        r.bold = True
        r.font.size = Pt(10)
        r2 = bp.add_run(b_desc)
        r2.font.size = Pt(10)

    # Section 2: Master Timing Table
    doc.add_heading("2. Master Agenda & Timing Breakdown (18 Minutes Total)", level=1)
    
    table_data = [
        ["Part", "Speaker", "Assigned Topic / Stage", "Duration", "Time Window", "Rubric Criteria Covered"],
        ["Part 1", "Member 4", "System Architecture, Deployment & Assignment 01 Changes", "3.0 min", "00:00 – 03:00", "Platform Architecture, Isolation, Validation Engine, Design Changes"],
        ["Part 2", "Member 1", "Stage 1: OSINT & Metadata Reconnaissance", "3.0 min", "03:00 – 06:00", "LO1 Information Gathering, ExifTool, Python Solver Script (LO3)"],
        ["Part 3", "Member 3", "Stage 2: Steganography (Hidden in Plain Sight)", "3.0 min", "06:00 – 09:00", "LO2 Steganography, Steghide DCT extraction, Python Solver Script (LO3)"],
        ["Part 4", "Member 2", "Stage 3: Classical Crypto & Stage 4: Network Forensics", "3.5 min", "09:00 – 12:30", "LO2 Classical substitution, Wireshark PCAP analysis, Scapy Parser (LO3)"],
        ["Part 5", "Member 3", "Stage 5: Advanced Cryptography (Vigenère Cipher)", "2.5 min", "12:30 – 15:00", "LO2 Polyalphabetic decryption, Key derivation, SSH Credential Pivot"],
        ["Part 6", "Member 4", "Stage 6: Capstone Live Target, Isolation & Reset Test", "3.0 min", "15:00 – 18:00", "Live AWS SSH (2222), zsteg, XOR dotfile decrypt, Platform Reset"]
    ]
    
    t = doc.add_table(rows=len(table_data), cols=6)
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r_idx, row in enumerate(table_data):
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
            set_cell_margins(cell, top=80, bottom=80, left=100, right=100)

    # Function to add formatted spoken section
    def add_presentation_part(part_num, speaker, title, duration, time_window, screen_actions, script_segments):
        doc.add_page_break()
        h = doc.add_heading(f"Part {part_num}: {title}", level=1)
        
        # Meta box
        p_meta = doc.add_paragraph()
        p_meta.paragraph_format.space_after = Pt(4)
        p_meta.add_run("Speaker: ").bold = True
        p_meta.add_run(f"{speaker}  |  ")
        p_meta.add_run("Duration: ").bold = True
        p_meta.add_run(f"{duration}  |  ")
        p_meta.add_run("Time Window: ").bold = True
        p_meta.add_run(f"{time_window}\n")
        
        # Actions box
        doc.add_heading("Live Screen Actions to Perform on Camera:", level=2)
        for act in screen_actions:
            bp = doc.add_paragraph(style='List Bullet')
            bp.paragraph_format.space_after = Pt(2)
            r = bp.add_run(act)
            r.font.size = Pt(10)

        doc.add_heading("Complete Spoken Script:", level=2)
        for sub_time, sub_title, text in script_segments:
            p_seg = doc.add_paragraph()
            p_seg.paragraph_format.space_before = Pt(4)
            p_seg.paragraph_format.space_after = Pt(2)
            r_head = p_seg.add_run(f"[{sub_time}] {sub_title}")
            r_head.bold = True
            r_head.font.color.rgb = RGBColor(0x00, 0x33, 0x66)
            
            p_body = doc.add_paragraph()
            p_body.paragraph_format.space_after = Pt(6)
            r_body = p_body.add_run(text)
            r_body.font.size = Pt(10.5)

    # Part 1
    add_presentation_part(
        1, "Member 4", "Project Architecture, Deployment & Assignment 01 Evolution",
        "3.0 Minutes", "00:00 – 03:00",
        [
            "Introduce yourself clearly on webcam with your full name and Student ID (ITxxxxxxx).",
            "Screen share terminal showing Docker containers running (docker-compose ps).",
            "Open browser to Kernel0X CTF portal (http://localhost:5173), showing the landing page and navigation.",
            "Display the architectural diagram showing the 3-tier structure (React, Express API, AWS EC2 sandbox)."
        ],
        [
            ("00:00 – 00:30", "Introduction & Project Scope",
             "Good day, everyone. My name is [Member 4 Name], Student ID [ITxxxxxxx], and I am the Integration and Architecture Lead for our group project: Kernel0X Breach Investigation Play Box. For Assignment 02, our group took the approved design from Assignment 01 and implemented a fully functional, highly realistic incident response play box. The challenge pathway follows a cohesive breach storyline across six chained stages covering five core cybersecurity domains: OSINT, Steganography, Classical Cryptography, Network Packet Forensics, and Live Target Exploitation."),
            ("00:30 – 01:45", "Platform Architecture, Network Segmentation & Security Controls",
             "Let us examine how our platform is engineered. The architecture consists of three segregated tiers: First, the Presentation Tier, built on React, Vite, and Tailwind CSS. It features a reactive cyber-operations dashboard with live state management, collapsible hint panels, automated payload passing between stages, and strict anti-cheat stage locking. Second, the Backend Verification & Scoring Engine, implemented in Node.js and Express. Flags are evaluated exclusively server-side using secure endpoints. We implemented a dynamic time-decay scoring model: each stage awards 100 Base XP plus up to 100 Speed Bonus XP that decays linearly over 60 minutes from when the stage was unlocked. Third, Security Isolation: Stages 1 through 5 run containerized locally, while our Capstone Stage 6 is hosted on an isolated AWS EC2 Linux instance with a hardened security group exposing strictly SSH port 2222, completely segmented from university networks."),
            ("01:45 – 03:00", "Evolution & Technical Changes from Assignment 01",
             "Compared to our Assignment 01 initial proposal, we implemented three key technical improvements: First, we engineered an automated session bridge from Stage 4 to Stage 5, passing raw reconstructed exfiltration data directly into the cryptanalysis console. Second, we moved Stage 6 from a local mock service to a true cloud-hosted AWS Linux environment on port 2222, providing authentic network latency and live SSH shell interaction. Third, we eliminated hardcoded credentials in favor of an investigative chain: clues discovered in Stage 1 and Stage 5 directly become the authentication factors for Stage 6. I will now hand over to Member 1 to demonstrate Stage 1.")
        ]
    )

    # Part 2
    add_presentation_part(
        2, "Member 1", "Stage 1: OSINT & Metadata Reconnaissance",
        "3.0 Minutes", "03:00 – 06:00",
        [
            "Introduce yourself clearly on webcam with your full name and Student ID (ITxxxxxxx).",
            "Navigate in browser to Stage 1: The First Lead in Kernel0X Portal.",
            "Display the downloaded investigator brief (investigator-brief.txt).",
            "Open GitHub public repository commit history for developer Daniel Perera.",
            "Run ExifTool in terminal on deployment-asset.png to reveal UserComment 'K0X-17'.",
            "Demonstrate running the self-developed Python solver script (stage1_osint_extract.py).",
            "Submit 'K0X-17' in the portal, show the success confirmation banner, and unlock Stage 2."
        ],
        [
            ("03:00 – 03:30", "Introduction & Challenge Narrative",
             "Hello, my name is [Member 1 Name], Student ID [ITxxxxxxx]. I am responsible for Challenge Design A, specifically Stage 1: The First Lead, covering Open Source Intelligence and Information Gathering (LO1). Our breach narrative begins with an alert: NexaLabs experienced suspicious development commits. The operative receives an investigator brief instructing them to locate the public footprint of developer Daniel Perera."),
            ("03:30 – 04:30", "Reconnaissance & Tool Selection (LO1, LO2)",
             "To construct this challenge, we created a realistic public GitHub repository. Rather than a trivial text leak, we introduced realistic commit history with pull requests and benign asset updates. By auditing Daniel Perera's commits, an investigator identifies a commit titled 'feat(assets): update deployment assets'. Downloading deployment-asset.png, we inspect its EXIF metadata using ExifTool: running 'exiftool -UserComment deployment-asset.png'. Hidden in the UserComment metadata field is an internal access code: K0X-17."),
            ("04:30 – 05:30", "Self-Developed Solver Script Walkthrough (LO3)",
             "To satisfy Learning Outcome 3, I authored a custom Python solver script: stage1_osint_extract.py. It uses subprocess and the json module to execute ExifTool in machine-readable JSON mode, programmatically parses the EXIF dictionary, and extracts the target access code automatically. Running the script live: 'python3 stage1_osint_extract.py deployment-asset.png', it immediately outputs our lead code: K0X-17."),
            ("05:30 – 06:00", "Platform Submission & Progression",
             "We now submit K0X-17 into the Stage 1 answer form. The server-side validation validates the answer, awards 150 points plus speed bonus XP, updates the live leaderboard, and unlocks Stage 2. This clue K0X-17 is also retained by the operative for subsequent stages. I now pass the demonstration to Member 3.")
        ]
    )

    # Part 3
    add_presentation_part(
        3, "Member 3", "Stage 2: Steganography (Hidden in Plain Sight)",
        "3.0 Minutes", "06:00 – 09:00",
        [
            "Introduce yourself clearly on webcam with your full name and Student ID (ITxxxxxxx).",
            "In Kernel0X portal, click Stage 2: Hidden in Plain Sight.",
            "Download carrier artifact hero-banner.jpg from the challenge download card.",
            "Run file and binwalk in terminal to prove no simple concatenated archive exists.",
            "Execute steghide in terminal using passphrase K0X-17 to extract extracted_payload.txt.",
            "Walk through and execute self-developed solver script stage2_stego_extract.py.",
            "Submit extracted ciphertext 'Rlyuls0E{jhlzhy_pz_jshzzpj}' into Stage 2 to unlock Stage 3."
        ],
        [
            ("06:00 – 06:30", "Introduction & Steganography Design",
             "Hello everyone. I am [Member 3 Name], Student ID [ITxxxxxxx]. I designed and implemented Stage 2: Hidden in Plain Sight, representing our steganography and data concealment component (LO2). Continuing the investigation, the operative discovers another asset from Daniel Perera's deployment commit: hero-banner.jpg. Although it appears to be a standard marketing graphic, the access code K0X-17 recovered in Stage 1 serves as our extraction passphrase."),
            ("06:30 – 07:30", "Technical Build & Tool Selection",
             "To build this challenge securely, we embedded the payload inside the Discrete Cosine Transform (DCT) coefficients of the JPEG using Steghide, encrypted with passphrase K0X-17. We intentionally avoided basic file concatenation or LSB appending so simple 'strings' or 'binwalk' commands cannot bypass the challenge. In terminal, running binwalk confirms no hidden zip headers exist. We then run: 'steghide extract -sf hero-banner.jpg -p K0X-17 -xf extracted.txt'. The extracted text contains an encrypted payload: Rlyuls0E{jhlzhy_pz_jshzzpj}."),
            ("07:30 – 08:30", "Self-Developed Stego Extraction Script (LO3)",
             "For Learning Outcome 3, I engineered a Python automation script: stage2_stego_extract.py. It programmatically wraps the Steghide extraction binary, manages temporary file descriptors, checks for successful extraction status, and reads the raw concealed payload without manual file interaction. Running our script live, it cleanly extracts and prints: Rlyuls0E{jhlzhy_pz_jshzzpj}."),
            ("08:30 – 09:00", "Submission & Stage Transition",
             "We submit this raw extracted ciphertext into Stage 2. The portal validates the payload, confirms that hidden data was recovered, and warns the investigator that the text is encrypted and requires classical decoding, unlocking Stage 3. I hand over to Member 2 for Stages 3 and 4.")
        ]
    )

    # Part 4
    add_presentation_part(
        4, "Member 2", "Stage 3 (Classical Crypto) & Stage 4 (Network Forensics)",
        "3.5 Minutes", "09:00 – 12:30",
        [
            "Introduce yourself clearly on webcam with your full name and Student ID (ITxxxxxxx).",
            "Stage 3: Show ciphertext 'Rlyuls0E{jhlzhy_pz_jshzzpj}' in portal. Run stage3_caesar_solver.py live.",
            "Explain that the numbers in the Stage 1 clue ('K0X-17') provide the key (shift 7 / ROT-7) needed to decode the cipher to 'Kernel0X{caesar_is_classic}'. Submit flag to unlock Stage 4.",
            "Stage 4: Download exfil-capture.pcap (1.7 KB). Open in Wireshark.",
            "Apply Wireshark filter 'ftp || ftp-data'. Follow TCP Stream on port 21 to find hostname 'ftp.warehouse9.nexalabs.local'.",
            "Follow TCP Stream on port 20 (FTP-DATA) to inspect transferred ciphertext.",
            "Run self-developed Scapy parser stage4_pcap_analyzer.py to extract full ciphertext.",
            "Submit ciphertext to complete Stage 4 and show automated bridge into Stage 5."
        ],
        [
            ("09:00 – 09:45", "Stage 3: Classical Cryptography & Caesar Solver (LO2, LO3)",
             "Hello, my name is [Member 2 Name], Student ID [ITxxxxxxx]. I am responsible for Challenge Design A, covering Stage 3: The Encrypted Note and Stage 4: The Exfiltration Trail. Stage 3 transitions the breach investigation to classical cryptanalysis. The payload from Stage 2—Rlyuls0E{jhlzhy_pz_jshzzpj}—retains flag punctuation and casing. Importantly, the numbers in the Stage 1 clue—K0X-17—are needed to decode the cipher: the trailing number 17 gives us our shift offset of 7 positions. To solve this, I wrote an automated Caesar shift solver in Python: stage3_caesar_solver.py. Applying the shift value 7 derived from the Stage 1 clue, the script cleanly recovers the plaintext flag: Kernel0X{caesar_is_classic}. Submitting this flag completes Stage 3 and unlocks Stage 4."),
            ("09:45 – 11:15", "Stage 4: Network Traffic Forensics in Wireshark (LO1, LO2)",
             "Moving into Stage 4: Network Forensics. The scenario states that the attacker exfiltrated staging data over an insecure protocol. We download the packet capture exfil-capture.pcap. Opening the capture in Wireshark, we filter out background DNS, ARP, and HTTP noise using the display filter: 'ftp || ftp-data'. Examining the FTP control conversation on TCP port 21 by following the TCP stream, we observe the client authentication and note a critical infrastructure clue: the server banner identifies the hostname as 'ftp.warehouse9.nexalabs.local'. Next, following the corresponding FTP-DATA stream on port 20, we reconstruct the transferred file content, which contains an encrypted string beginning with 'OTRKL5_TFSK=...'."),
            ("11:15 – 12:30", "Self-Developed PCAP Stream Parser & Bridge (LO3)",
             "To fulfill Learning Outcome 3, I developed a Scapy-based network analysis script: stage4_pcap_analyzer.py. The script reads the PCAP file, filters packets matching TCP ports 20 and 21, isolates data payload segments, and outputs the exact raw exfiltration string without needing Wireshark GUI interaction. Executing the script live extracts the full string: OTRKL5_TFSK=Geirlz0R{oeneysbgy9_nmceeiys}|MLECE6_YSZH=... Submitting this payload validates Stage 4 and bridges the recovered ciphertext directly into Stage 5. I will now hand back to Member 3.")
        ]
    )

    # Part 5
    add_presentation_part(
        5, "Member 3", "Stage 5: Advanced Cryptography (Vigenère Decryption & Credential Pivot)",
        "2.5 Minutes", "12:30 – 15:00",
        [
            "Introduce yourself clearly on webcam with your full name and Student ID (ITxxxxxxx).",
            "In portal, navigate to Stage 5: The Second Cipher. Show that ciphertext was passed from Stage 4.",
            "Explain Vigenère key derivation from the Stage 4 hostname (WAREHOUSE).",
            "Run self-developed Python solver script stage5_vigenere_solver.py in terminal.",
            "Submit recovered flag 'Kernel0X{warehouse9_vigenere}'.",
            "Highlight the crucial intelligence notice: 'This flag is also your Stage 6 SSH password'."
        ],
        [
            ("12:30 – 13:15", "Polyalphabetic Decryption & Key Derivation",
             "Welcome back. I am [Member 3], presenting Stage 5: The Second Cipher, representing our advanced cryptography component. Unlike the monoalphabetic cipher in Stage 3, Stage 5 implements a polyalphabetic Vigenère cipher. Notice that our platform automatically loaded the exfiltrated ciphertext from Stage 4. Recall the hostname discovered by Member 2 in the FTP control traffic: ftp.warehouse9.nexalabs.local. The distinct keyword identifying this server is 'WAREHOUSE'. We test this keyword as our repeating Vigenère decryption key."),
            ("13:15 – 14:15", "Mathematical Decryption & Python Solver (LO3)",
             "To automate this stage, I authored stage5_vigenere_solver.py in Python. The script implements modular subtraction: Pi = (Ci - Ki) mod 26 across uppercase and lowercase character ranges while preserving non-alphabetic formatting. When we run the script with key 'WAREHOUSE', the ciphertext decrypts into structured key-value parameters: STAGE5_FLAG=Kernel0X{warehouse9_vigenere}. Our recovered flag is Kernel0X{warehouse9_vigenere}."),
            ("14:15 – 15:00", "Submission & Stage 6 Credential Pivot",
             "We submit Kernel0X{warehouse9_vigenere} into Stage 5. The platform confirms the solve, awards 150 points, and displays an essential intelligence alert: '⚠ INTELLIGENCE NOTE: This flag is also your Stage 6 SSH password.' This completes our credential chain: the username K0X-17 recovered in Stage 1 and this Stage 5 flag together authenticate the operative into our final capstone server. I now pass back to Member 4 for Stage 6.")
        ]
    )

    # Part 6
    add_presentation_part(
        6, "Member 4", "Stage 6: Capstone Live Target (SSH + Stego + XOR), Security Isolation & Reset",
        "3.0 Minutes", "15:00 – 18:00",
        [
            "Introduce yourself clearly on webcam with your full name and Student ID (ITxxxxxxx).",
            "In portal, open Stage 6: Capstone. Show Target 47.129.24.175, Port 2222, Protocol SSH.",
            "Connect live via SSH in terminal: ssh -p 2222 K0X-17@47.129.24.175 using Stage 5 password.",
            "Run zsteg on /opt/stage6/dead-drop.png to reveal VICRQU_YTB=SRELK.",
            "Decrypt with Vigenère key DEADDROP to obtain SECOND_KEY=ORBIT.",
            "Inspect hidden dotfile cat ~/.final-message containing hex ciphertext.",
            "Run stage6_capstone_solver.py to XOR decrypt with key ORBIT -> reveals Kernel0X{dead_drop_recovered}.",
            "Submit final flag into portal. Show the celebration modal with trophy burst and XP summary.",
            "Click [VIEW THANK YOU & CERTIFICATE] to show the dedicated Thank You page (/thank-you).",
            "Show the printable Certificate of Excellence and investigation recap.",
            "Demonstrate platform reset by clicking [ RESET ] button to show full restoration."
        ],
        [
            ("15:00 – 15:45", "Capstone Live Target Connection",
             "This is [Member 4] presenting our capstone challenge: Stage 6: Kernel0X's Final Message (LO1, LO2, LO3). As displayed on our portal, Stage 6 connects to our isolated AWS EC2 Linux sandbox at 47.129.24.175 on SSH port 2222. In our credential box, the username is the access code recovered in Stage 1 (K0X-17) and the password is our Stage 5 flag (Kernel0X{warehouse9_vigenere}). In terminal, we run: 'ssh -p 2222 K0X-17@47.129.24.175'. We enter our Stage 5 flag as password, and we are granted live shell access to the target host."),
            ("15:45 – 16:45", "Live Multi-Layer Exploitation (zsteg + XOR) (LO2, LO3)",
             "Inside the machine, we locate the dead-drop image at /opt/stage6/dead-drop.png. Unlike Stage 2, this image conceals data in the least-significant bit planes. Running 'zsteg /opt/stage6/dead-drop.png' extracts: VICRQU_YTB=SRELK. Decrypting this with keyword DEADDROP reveals: SECOND_KEY=ORBIT. Next, checking hidden files with 'ls -la ~', we discover the dotfile .final-message containing hex data: 043730273123621a... I wrote this Python XOR solver script on the target: stage6_capstone_solver.py. It takes the hex stream and XOR-combines it with repeating key ORBIT. Executing the script outputs our final flag: Kernel0X{dead_drop_recovered}."),
            ("16:45 – 17:30", "Flag Verification, Celebration Modal & Thank You Page",
             "We paste Kernel0X{dead_drop_recovered} into the Stage 6 submission form. The server-side API verifies the flag, awards 200 points, marks all stages completed, and triggers our live Celebration Modal. Clicking through, we arrive at our dedicated 'Thank You for Participating' page (/thank-you). Here, the operative receives an official Certificate of Excellence complete with a cryptographic authenticity hash and printable layout, alongside a full recap of all six resolved investigation milestones and an operative debrief form."),
            ("17:30 – 18:00", "Reset / Recovery Mechanism & Final Conclusion",
             "Finally, we demonstrate the required reset mechanism. Clicking the [ RESET ] button immediately resets operative progress, re-locks stages 2 through 6, wipes stored session artifacts, and restarts the time-decay scoring engine, allowing another investigator to complete the box from scratch. In summary, all four members have demonstrated full functionality, technical depth with original solver scripts, strict security isolation, and reliable recovery. Thank you very much.")
        ]
    )

    # Section: Code Scripts Annex
    doc.add_page_break()
    doc.add_heading("7. Self-Developed Exploit & Solver Scripts Annex (LO3 Compliance)", level=1)
    
    p = doc.add_paragraph()
    p.add_run("The following original scripts were self-developed by each team member to fulfill Learning Outcome 3 (Develop exploitation code to facilitate penetration testing). They are executed live during the recording:")
    
    scripts = [
        ("Script 1: Stage 1 OSINT & Metadata Extractor (Member 1)", "Python 3", """import subprocess, json, sys

def extract_stage1_clue(image_path="deployment-asset.png"):
    cmd = ["exiftool", "-j", image_path]
    proc = subprocess.run(cmd, capture_output=True, text=True, check=True)
    metadata = json.loads(proc.stdout)[0]
    clue = metadata.get("UserComment") or metadata.get("Comment")
    print(f"[+] Successfully extracted Stage 1 Lead: {clue}")
    return clue

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "deployment-asset.png"
    extract_stage1_clue(target)"""),
        
        ("Script 2: Stage 2 Steghide Payload Extractor (Member 3)", "Python 3", """import subprocess, os

def extract_stage2_payload(carrier="hero-banner.jpg", passphrase="K0X-17"):
    out_file = "stage2_payload.txt"
    cmd = ["steghide", "extract", "-sf", carrier, "-p", passphrase, "-xf", out_file, "-f"]
    subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(out_file):
        with open(out_file, "r") as f:
            content = f.read().strip()
        print(f"[+] Extracted Stage 2 Ciphertext: {content}")
        return content
    return None

if __name__ == "__main__":
    extract_stage2_payload()"""),

        ("Script 3: Stage 3 Caesar Cipher Decryptor (Member 2)", "Python 3", """import re

# Stage 3 Caesar Cipher Decryptor
# Note: The numbers in the Stage 1 clue ('K0X-17') provide the key needed to decode this cipher (Shift = 7)
def solve_caesar(ciphertext="Rlyuls0E{jhlzhy_pz_jshzzpj}", clue_code="K0X-17"):
    print(f"[*] Analyzing Ciphertext: {ciphertext}")
    # Extract shift offset from Stage 1 clue numbers (17 -> offset 7)
    shift = int(re.findall(r'\\d+', clue_code)[-1]) % 10  # 17 -> 7
    print(f"[*] Stage 1 Clue Reference: '{clue_code}' -> Extracted Shift Offset: {shift}")
    
    decoded = []
    for ch in ciphertext:
        if 'a' <= ch <= 'z':
            decoded.append(chr((ord(ch) - 97 - shift) % 26 + 97))
        elif 'A' <= ch <= 'Z':
            decoded.append(chr((ord(ch) - 65 - shift) % 26 + 65))
        else:
            decoded.append(ch)
    res = "".join(decoded)
    if re.search(r"Kernel0X\\{.*\\}", res):
        print(f"[+] SUCCESS (Decoded using Stage 1 clue shift {shift}): {res}")
        return res
    return None

if __name__ == "__main__":
    solve_caesar()"""),

        ("Script 4: Stage 4 Network PCAP FTP Stream Parser (Member 2)", "Python 3 / Scapy", """from scapy.all import rdpcap, TCP, Raw

def extract_ftp_payload(pcap_path="exfil-capture.pcap"):
    packets = rdpcap(pcap_path)
    payload = b""
    for pkt in packets:
        if pkt.haslayer(TCP) and pkt.haslayer(Raw):
            if pkt[TCP].dport == 20 or pkt[TCP].sport == 20:
                payload += pkt[Raw].load
    decoded = payload.decode('utf-8', errors='ignore').strip()
    print(f"[+] Extracted FTP-DATA Payload:\\n{decoded}")
    return decoded

if __name__ == "__main__":
    extract_ftp_payload()"""),

        ("Script 5: Stage 5 Vigenère Decryptor & Key Derivation (Member 3)", "Python 3", """def vigenere_decrypt(ciphertext, key="WAREHOUSE"):
    key = key.upper()
    plain = []
    k_idx = 0
    for ch in ciphertext:
        if 'a' <= ch <= 'z':
            shift = ord(key[k_idx % len(key)]) - 65
            plain.append(chr((ord(ch) - 97 - shift + 26) % 26 + 97))
            k_idx += 1
        elif 'A' <= ch <= 'Z':
            shift = ord(key[k_idx % len(key)]) - 65
            plain.append(chr((ord(ch) - 65 - shift + 26) % 26 + 65))
            k_idx += 1
        else:
            plain.append(ch)
    return "".join(plain)

if __name__ == "__main__":
    cipher = "OTRKL5_TFSK=Geirlz0R{oeneysbgy9_nmceeiys}"
    print("[+] Decrypted Flag:", vigenere_decrypt(cipher, "WAREHOUSE"))"""),

        ("Script 6: Stage 6 Capstone XOR Decryptor (Member 4)", "Python 3", """def solve_stage6_dotfile(hex_str="043730273123621a0b3a30363025213b342037233220302b", key=b"ORBIT"):
    raw = bytes.fromhex(hex_str)
    flag = bytes([b ^ key[i % len(key)] for i, b in enumerate(raw)]).decode()
    print(f"[+] Capstone Decrypted Flag: {flag}")
    return flag

if __name__ == "__main__":
    solve_stage6_dotfile()""")
    ]

    for s_title, s_lang, s_code in scripts:
        doc.add_heading(s_title, level=2)
        p_c = doc.add_paragraph()
        p_c.paragraph_format.space_before = Pt(2)
        p_c.paragraph_format.space_after = Pt(6)
        r_c = p_c.add_run(s_code)
        r_c.font.name = 'Consolas'
        r_c.font.size = Pt(9.5)
        r_c.font.color.rgb = RGBColor(0x1B, 0x5E, 0x20)

    # Practical Zoom Recording Checklist
    doc.add_page_break()
    doc.add_heading("8. Zoom Video Recording & Evaluation Checklist", level=1)
    
    check_items = [
        "Single Recording Rule: The entire walkthrough is recorded as a single MP4 file under 20 minutes (Target: exactly 18:00).",
        "Individual Appearance: Each member appears on camera and announces their Name and Student ID before speaking.",
        "Live Execution: Only real running browsers, terminals, Wireshark, and SSH shells are shown. No slides or animations.",
        "Resolution & Clarity: Zoom screen sharing set to 1080p (minimum 720p). Terminal font sizes increased to 16pt for legibility.",
        "Unintended Shortcuts: Demonstrated that each stage requires the genuine cryptographic/forensic solution path.",
        "Reset Mechanism: Showed that hitting [ RESET ] reliably restores the play box to its initial clean state.",
        "Submission Package: Package named ITXXX_ITXXX_ITXXX_ITXXX containing the MP4 video, CTF box files, source code, and README."
    ]
    for ci in check_items:
        bp = doc.add_paragraph(style='List Bullet')
        bp.paragraph_format.space_after = Pt(4)
        r = bp.add_run(ci)
        r.font.size = Pt(10)

    output_path = r"c:\Users\Muditha\Desktop\Kernel0x\Kernel0X_18Min_Presentation_Script.docx"
    try:
        doc.save(output_path)
        print(f"[+] Document created successfully at: {output_path}")
    except PermissionError:
        output_path_alt = r"c:\Users\Muditha\Desktop\Kernel0x\Kernel0X_18Min_Presentation_Script_Updated.docx"
        doc.save(output_path_alt)
        print(f"[+] Document created successfully at (alternate path because original is open in Word): {output_path_alt}")

if __name__ == "__main__":
    create_document()
