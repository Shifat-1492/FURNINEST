# Update Contact Information in Navbar Header

## Current State
- `Footer.jsx` already updated with: 📧 ahmmedshifat64649@gmail.com, 📱 01761647173
- `Navbar.jsx` has old placeholder info: 📞 +880 1234-567890, 📧 support@furninest.com

## Changes Needed
1. Update `frontend/src/components/Navbar.jsx` lines 11-12:
   - Change `📞 Contact: +880 1234-567890` → `📞 Contact: 01761647173`
   - Change `📧 support@furninest.com` → `📧 ahmmedshifat64649@gmail.com`

## Validation
- Run `npm run build` in frontend to verify no build errors
- Check that the header displays correctly on http://localhost:5173