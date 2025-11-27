# 🔧 Expo Go Timeout Error Fix

## 🚨 Problem
You're getting a timeout error in Expo Go:
- "the requested timeout veriyor" (timeout verifier error)
- `exp://172.25.88.206:8081` connection issue

## ✅ Solutions

### Solution 1: Use Tunnel Mode (Recommended)

Tunnel mode uses Expo's servers to bypass network issues:

```bash
npx expo start --tunnel
```

This will:
- Create a tunnel through Expo's servers
- Generate a new QR code
- Work even if your phone and computer are on different networks
- Avoid local network connection issues

**Steps:**
1. Stop your current Expo server (Ctrl+C)
2. Run: `npx expo start --tunnel`
3. Wait for the QR code to appear
4. Scan the QR code with Expo Go

---

### Solution 2: Clear Cache and Restart

Sometimes cached data causes connection issues:

```bash
npx expo start --clear
```

Or manually clear:
```bash
# Clear Metro bundler cache
npx expo start -c

# Clear all caches
rm -rf node_modules/.cache
rm -rf .expo
npm start -- --clear
```

---

### Solution 3: Check Network Connection

**On Windows:**

1. **Check if devices are on same network:**
   - Computer and phone must be on the same WiFi network
   - Or use tunnel mode (Solution 1)

2. **Check Windows Firewall:**
   - Open Windows Defender Firewall
   - Allow Node.js through firewall
   - Or temporarily disable firewall to test

3. **Check IP Address:**
   - The IP `172.25.88.206` should be your computer's local IP
   - Verify it's correct: Open Command Prompt and run `ipconfig`
   - Look for "IPv4 Address" under your WiFi adapter

---

### Solution 4: Use LAN Mode Explicitly

Try starting Expo with LAN mode:

```bash
npx expo start --lan
```

This forces Expo to use your local network IP address.

---

### Solution 5: Check Port 8081

Make sure port 8081 is not blocked:

**On Windows PowerShell (as Administrator):**
```powershell
# Check if port is in use
netstat -ano | findstr :8081

# If something is using it, kill the process
# Find the PID from above command, then:
taskkill /PID <PID> /F
```

---

### Solution 6: Restart Everything

1. **Stop all Expo processes:**
   ```bash
   # Press Ctrl+C in all terminal windows running Expo
   ```

2. **Kill any remaining Node processes:**
   ```powershell
   # In PowerShell
   Get-Process node | Stop-Process -Force
   ```

3. **Restart Expo:**
   ```bash
   npm start
   ```

---

## 🎯 Quick Fix Checklist

Try these in order:

- [ ] **Solution 1**: Use `npx expo start --tunnel` (easiest fix)
- [ ] **Solution 2**: Clear cache with `npx expo start --clear`
- [ ] **Solution 3**: Check Windows Firewall settings
- [ ] **Solution 4**: Try `npx expo start --lan`
- [ ] **Solution 5**: Check if port 8081 is available
- [ ] **Solution 6**: Restart all processes

---

## 🔍 Debugging Steps

### 1. Check Expo Server Status

When you run `npm start`, you should see:
```
Metro waiting on exp://172.25.88.206:8081
```

If you see errors, check:
- Is the IP address correct?
- Is port 8081 available?
- Is Windows Firewall blocking it?

### 2. Test Connection from Phone

On your phone's browser, try opening:
```
http://172.25.88.206:8081
```

If this doesn't work, the network connection is the issue.

### 3. Check Expo Go App

- Make sure Expo Go app is up to date
- Try closing and reopening Expo Go
- Try scanning the QR code again

---

## 💡 Best Practice: Always Use Tunnel Mode

For mobile development, tunnel mode is the most reliable:

```bash
npx expo start --tunnel
```

**Advantages:**
- Works on any network
- No firewall issues
- No IP address problems
- More reliable connection

**Disadvantages:**
- Slightly slower (goes through Expo servers)
- Requires internet connection

---

## 📝 Notes

- **IP Address**: `172.25.88.206` is your computer's local IP
- **Port**: `8081` is the default Expo port
- **Timeout**: Usually happens when phone can't reach the computer
- **Tunnel Mode**: Best solution for connection issues

---

## ✅ Success Indicators

You'll know it's working when:
- Expo Go connects without timeout
- You see "Connected to Metro bundler" in Expo Go
- The app loads in Expo Go
- Hot reload works

---

## 🆘 Still Not Working?

If none of these solutions work:

1. **Check Expo CLI version:**
   ```bash
   npx expo --version
   ```

2. **Update Expo:**
   ```bash
   npm install -g expo-cli@latest
   ```

3. **Check Node.js version:**
   ```bash
   node --version
   ```
   Should be Node 16+ for Expo SDK 54

4. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules
   npm install
   ```

5. **Check for error messages** in the terminal when starting Expo

---

## 🎉 Quick Command Reference

```bash
# Tunnel mode (best for mobile)
npx expo start --tunnel

# Clear cache
npx expo start --clear

# LAN mode
npx expo start --lan

# Normal mode
npm start
```


