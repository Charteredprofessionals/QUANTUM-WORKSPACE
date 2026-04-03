# Quantum Workspace - Tauri Desktop App

This directory contains the Tauri (Electron alternative) desktop application.

## Prerequisites

Before building, install:

### 1. Install Rust
```bash
# macOS / Linux
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Windows (PowerShell)
winget install Rustlang.Rust.MSVC
```

### 2. Install Tauri CLI
```bash
cargo install tauri-cli
```

### 3. Install Node.js (for frontend)
```bash
# macOS
brew install node

# Ubuntu
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## Build Commands

### Development Mode
```bash
cd tauri
cargo tauri dev
```

### Production Build
```bash
cd tauri
cargo tauri build
```

## Output

After build, executables are in:
- **Windows**: `src-tauri/target/release/quantum-workspace.exe`
- **macOS**: `src-tauri/target/release/Quantum Workspace.app`
- **Linux**: `src-tauri/target/release/quantum-workspace`

## Project Structure

```
tauri/
├── src-tauri/
│   ├── src/
│   │   ├── main.rs       # Rust entry point
│   │   └── build.rs      # Build script
│   ├── Cargo.toml       # Rust dependencies
│   ├── build.rs         # Build config reference
│   └── tauri.conf.json  # Tauri configuration
└── tauri.conf.json      # Main Tauri config
```

## Icons

Generate icons using:
```bash
cargo tauri icon ../web/public/icon.png
```

Use a 1024x1024 PNG as source.

---

## Quick Start (One-time setup)

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Tauri CLI
cargo install tauri-cli

# Build
cd tauri
cargo tauri build
```

---

## Troubleshooting

### "command not found: tauri"
```bash
cargo install tauri-cli
```

### "error: no such command 'tauri'"
```bash
cargo install tauri-cli
```

### Build fails on Windows
Ensure Visual Studio Build Tools are installed.

---

## License

**PROPRIETARY** - Copyright © 2026 Quantum Technologies