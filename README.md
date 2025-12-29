# TestBolt - Lightning-Fast Mobile Automation Framework

A modern mobile automation framework designed to overcome the common pain points of existing tools.

## Architecture

**MobileAuto is a smart framework layer** built on top of proven tools (Appium/WebDriverIO) with significant enhancements:
- ✅ **AI-powered element detection** (new capability)
- ✅ **Multi-strategy finding** (solves flakiness)
- ✅ **Simple high-level API** (vs complex Appium)
- ✅ **Unified device management** (local/cloud/emulator)
- ✅ **Automatic retry logic** (built-in stability)

See [ARCHITECTURE_DETAILED.md](./ARCHITECTURE_DETAILED.md) for complete architecture explanation.

## Key Features Addressing Market Pain Points

### 1. **AI-Powered Element Detection** (Solves: Flaky Tests)
- Computer vision-based element detection
- Self-healing selectors that adapt to UI changes
- Multi-strategy element finding (ID, text, image, position)
- Automatic retry with intelligent waiting

### 2. **Unified Device Management** (Solves: Device Fragmentation)
- Cloud-based device farm integration
- Local device support
- Emulator/simulator management
- Automatic device selection based on test requirements
- Parallel execution across multiple devices

### 3. **Zero-Config Setup** (Solves: Complex Setup)
- Automatic dependency detection and installation
- Smart defaults for common scenarios
- Single command setup: `mobileauto init`
- Built-in project templates

### 4. **Advanced Feature Support** (Solves: Limited Features)
- Native biometric authentication (Face ID, Fingerprint)
- Gesture recognition and execution
- Image injection and manipulation
- Chatbot interaction
- Deep linking support

### 5. **Test Stability** (Solves: Flaky Tests)
- Intelligent wait strategies
- Automatic retry mechanisms
- Environment health checks
- Test isolation and cleanup
- Screenshot and video recording on failure

### 6. **Fast Execution** (Solves: Slow Testing)
- Parallel test execution
- Test prioritization
- Smart test selection (run only affected tests)
- Incremental testing support

### 7. **Cost-Effective** (Solves: High Costs)
- Open-source core
- Efficient resource utilization
- Local device prioritization
- Cloud device pooling

### 8. **Developer-Friendly** (Solves: Complex Maintenance)
- Simple, intuitive API
- TypeScript/JavaScript support
- Built-in test recorder
- Visual test builder
- Comprehensive logging and debugging

## Architecture

```
mobileAuto/
├── core/              # Core automation engine
├── ai/                # AI-powered element detection
├── devices/           # Device management layer
├── integrations/      # Third-party integrations
├── recorder/          # Test recording capabilities
└── cli/               # Command-line interface
```

## Quick Start

```bash
# Install
npm install -g testbolt

# Initialize project
mobileauto init

# Run tests
testbolt test
```

See [QUICKSTART.md](./QUICKSTART.md) for detailed setup instructions.

## POC (Proof of Concept)

Want to see how the automation actually works? Check out our POC examples:

- [POC Guide](./POC_GUIDE.md) - Quick start for POC
- [Step-by-Step POC](./POC_STEP_BY_STEP.md) - Detailed instructions
- [POC Examples](./poc-examples/) - Working code examples
- [Visual Example](./poc-examples/VISUAL_EXAMPLE.md) - See what execution looks like

Quick start:
```bash
./poc-setup.sh
npm test poc-examples/simple-poc.test.ts
```

## App Compatibility

✅ **Yes, the framework can automate most Android and iOS apps!**

- **Native Apps**: Full support (Java/Kotlin, Swift/Objective-C)
- **Hybrid Apps**: Full support (React Native, Flutter, Ionic)
- **Web Apps**: Full support (PWA, WebView)
- **All Android versions**: 5.0+ (API 21+)
- **All iOS versions**: 10.0+

See [APP_COMPATIBILITY.md](./APP_COMPATIBILITY.md) for detailed compatibility information.

## Example Test

```typescript
import { MobileAuto, Device } from 'mobileauto';

const app = new MobileAuto({
  device: 'cloud:iPhone-14-Pro',
  app: './app.apk'
});

test('Login Flow', async () => {
  await app.launch();
  
  // AI-powered element finding - adapts to UI changes
  await app.find('Login Button').click();
  await app.find('Email Input').type('user@example.com');
  await app.find('Password Input').type('password123');
  await app.find('Submit').click();
  
  // Advanced features
  await app.authenticate.biometric('face-id');
  await app.gesture.swipe('up');
  
  // Assertions with auto-retry
  await app.expect(app.find('Dashboard')).toBeVisible();
});
```

