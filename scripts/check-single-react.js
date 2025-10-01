// Verification script to ensure single React instance across all dependencies
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const require = createRequire(import.meta.url);

console.log("🔍 Checking React instance resolution...\n");

try {
  const reactPath = require.resolve("react");
  const reactDomPath = require.resolve("react-dom");
  
  console.log("✅ React resolved to:");
  console.log(`   ${reactPath}\n`);
  
  console.log("✅ ReactDOM resolved to:");
  console.log(`   ${reactDomPath}\n`);
  
  // Check if both resolve to project root's node_modules (not nested)
  const projectRoot = path.resolve(__dirname, "..");
  const expectedReactPath = path.join(projectRoot, "node_modules", "react");
  const expectedDomPath = path.join(projectRoot, "node_modules", "react-dom");
  
  const reactInRoot = reactPath.startsWith(expectedReactPath);
  const domInRoot = reactDomPath.startsWith(expectedDomPath);
  
  if (reactInRoot && domInRoot) {
    console.log("✅ SUCCESS: Both React and ReactDOM resolve to project root's node_modules");
    console.log("   No nested duplicates detected.\n");
    process.exit(0);
  } else {
    console.error("❌ WARNING: React versions may be duplicated in nested packages");
    if (!reactInRoot) console.error(`   React not in root: ${reactPath}`);
    if (!domInRoot) console.error(`   ReactDOM not in root: ${reactDomPath}`);
    console.error("\n   Run: npm ls react react-dom\n");
    process.exit(1);
  }
} catch (error) {
  console.error("❌ ERROR: Could not resolve React packages");
  console.error(`   ${error.message}\n`);
  process.exit(1);
}
