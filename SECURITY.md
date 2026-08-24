# 🛡️ Security Policy - Bharat Yatra (भारत यात्रा)

The Bharat Yatra team takes the security of our tourism platform, users' data, and administrative operations seriously. This document outlines our security policies, supported versions, and guidelines for responsibly reporting vulnerabilities.

---

## 📦 Supported Versions

Security patches and updates are actively maintained for the following versions:

| Version | Release Status | Security Support |
| :--- | :--- | :--- |
| `v1.2.x` (Latest) | Active Development | :white_check_mark: Fully Supported |
| `v1.1.x` | Stable Release | :white_check_mark: Supported (Critical Only) |
| `v1.0.x` | Initial Prototype | :x: End of Life |

---

## 🔒 Security Architecture & Practices

Bharat Yatra implements a multi-layered defense model across its MERN stack:

1. **Authentication & Authorization**:
   - Passwords hashed using `bcryptjs` with salt rounds.
   - Stateless JWT tokens (`jsonwebtoken`) for session management.
   - Strict Role-Based Access Control (`User` vs `Admin`) preventing unauthorized administrative access.
   - **Creator-Only Resource Protection**: Monuments and destinations created by an administrator can only be modified or removed by their original creator.

2. **Database & Data Integrity**:
   - Mongoose schemas with strict data typing, validation, and sanitization to prevent NoSQL injection.
   - Isolated collections in MongoDB Atlas (`users`, `admins`, `destinations`, `itineraries`, `reviews`).

3. **Secrets & Environment Management**:
   - All connection strings, API keys (Geoapify, Open-Meteo), and JWT secrets are strictly managed via `.env` files.
   - Comprehensive `.gitignore` protection prevents unintentional commits of credentials or `.env` files to public source control.

4. **External API Integrations**:
   - External calls (Wikipedia, Wikimedia Commons, Open-Meteo, Geoapify) are verified and sanitized before rendering to prevent XSS.

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability or sensitive data exposure in Bharat Yatra:

1. **Do NOT open a public GitHub issue** describing the vulnerability.
2. Please report the issue privately by emailing the maintainers at:
   - 📧 **security@bharatyatra.com** or **ajitkumarsaini02@gmail.com**
   - Alternatively, use GitHub's **Private Vulnerability Reporting** feature in the repository.

### What to Include in Your Report:
- Detailed description of the vulnerability.
- Step-by-step reproduction instructions or Proof of Concept (PoC).
- Potential impact on travelers, administrators, or backend infrastructure.
- Suggested remediation or patch (if available).

---

## ⏱️ Response Timeframes & Disclosure

- **Acknowledgment:** We will acknowledge receipt of your vulnerability report within **24–48 hours**.
- **Assessment & Triage:** Our team will review the validity and impact within **3 to 5 business days**.
- **Fix & Patch Deployment:** Critical vulnerabilities will be prioritized and resolved as swiftly as possible.
- **Public Disclosure:** We kindly ask that you allow reasonable time for a patch to be deployed before disclosing the issue publicly.

---

## 🤝 Safe Harbor

If you conduct vulnerability research in good faith according to this policy, we will not pursue legal action against you. Thank you for helping keep Bharat Yatra secure for travelers across the globe! 🇮🇳
