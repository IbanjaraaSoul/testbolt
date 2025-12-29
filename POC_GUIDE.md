# POC (Proof of Concept) Guide

This guide will help you create a working POC with MobileAuto framework on a real mobile app.

## Quick Start

```bash
# 1. Run setup script
./poc-setup.sh

# 2. Start Appium (in separate terminal)
appium

# 3. Run simple POC
npm test poc-examples/simple-poc.test.ts
```

## Prerequisites

1. **Node.js** 16+ installed
2. **Android SDK** (for Android apps) or **Xcode** (for iOS apps)
3. **Appium** installed globally: `npm install -g appium`
4. **A mobile app** (.apk for Android or .ipa for iOS)

## POC Examples

We've created three POC examples:

1. **simple-poc.test.ts** - Minimal example to get started
2. **ecommerce-login.test.ts** - Real-world login flow
3. **advanced-features-poc.test.ts** - Advanced features demo

See [POC_STEP_BY_STEP.md](./POC_STEP_BY_STEP.md) for detailed step-by-step instructions.

## What the Automation Looks Like

### Simple Example:
```typescript
const app = new MobileAuto({
  device: 'auto',
  app: './app.apk'
});

await app.launch();
await app.find('Login').click();
await app.find('Email').type('user@example.com');
await app.close();
```

### Real-World Example:
See `poc-examples/ecommerce-login.test.ts` for a complete login flow automation.

