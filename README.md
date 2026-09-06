# Kernel0X

**Kernel0X** is a progressive Capture The Flag (CTF) Play Box designed for campus-level cybersecurity learning. It challenges participants through a simulated security investigation scenario, guiding them from open-source reconnaissance through steganography, cryptography, network analysis, and web exploitation — culminating in a multi-domain capstone challenge.

## Overview

| Field | Detail |
|---|---|
| **Target Audience** | Campus students (SLIIT), beginner–intermediate skill level |
| **Number of Stages** | 6 |
| **Domains Covered** | OSINT, Steganography, Cryptography, Networking, Web Security |
| **Flag Format** | `Kernel0X{...}` |
| **Platform Type** | Hybrid (file-based challenges + live containerized web challenge) |

## Challenge Progression

| Stage | Domain | Difficulty | Delivery Mode |
|---|---|---|---|
| 1 | OSINT / Reconnaissance | Easy | File/Link-based |
| 2 | Steganography | Easy | Downloadable file |
| 3 | Cryptography | Moderate | Downloadable file/text |
| 4 | Networking | Moderate | Downloadable file (.pcap) |
| 5 | Web Technologies / Web Security | Moderate–Hard | Live IP address (containerized) |
| 6 | Capstone (Steganography + Cryptography) | Hard | Downloadable file |

## Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Spring Boot
- **Database:** MySQL
- **Isolation:** Docker (for Stage 5 live web challenge)

## Theme

**Colors:**
| Color | Hex |
|---|---|
| Accent Red | `#dc1327` |
| Dark Navy | `#0c141b` |
| Slate | `#151c21` |
| White | `#ffffff` |
| Black | `#000000` |

**Font:** Blender Pro (Heavy / Book / Thin)

## Status

This repository currently represents the **design and planning stage** (Assignment 01 — IE3132 Penetration Testing) for the Kernel0X CTF Play Box. Full implementation follows in later stages of the module.

