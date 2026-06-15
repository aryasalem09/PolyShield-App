## 2026-06-15 - [HIGH] Fix potential XSS in MFA QR code rendering
**Vulnerability:** The MFA QR code SVG returned by Supabase was rendered directly into the DOM using `dangerouslySetInnerHTML` without any sanitization. This is a potential Cross-Site Scripting (XSS) vulnerability.
**Learning:** We need to sanitize external HTML/SVG inputs, especially in security-sensitive features like MFA enrollment, to prevent XSS attacks.
**Prevention:** Always use a sanitization library like `dompurify` before rendering external HTML/SVG inputs using `dangerouslySetInnerHTML`.
