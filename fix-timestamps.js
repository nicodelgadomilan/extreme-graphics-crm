const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');

// Find all route files
const files = execSync('find src/app/api -type f -name "route.ts"', {encoding: 'utf8'})
	.trim()
	.split('\n');

files.forEach(filePath => {
	if (!fs.existsSync(filePath)) return;
	
	let content = fs.readFileSync(filePath, 'utf8');
	let modified = false;
	
	// Pattern 1: Remove "const now = new Date().toISOString();" lines
	if (content.includes('const now = new Date().toISOString()')) {
		content = content.replace(/\s*const now = new Date\(\)\.toISOString\(\);?\s*/g, '\n');
		modified = true;
	}
	
	// Pattern 2: Remove createdAt: now, and updatedAt: now, from .values({})
	if (content.match(/createdAt:\s*now,?\s*\n/)) {
		content = content.replace(/,?\s*createdAt:\s*now,?\s*\n/g, '\n');
		modified = true;
	}
	
	if (content.match(/updatedAt:\s*now,?\s*\n/)) {
		content = content.replace(/,?\s*updatedAt:\s*now,?\s*\n/g, '\n');
		modified = true;
	}
	
	// Pattern 3: Remove createdAt: timestamp, and updatedAt: timestamp
	if (content.match(/createdAt:\s*timestamp,?\s*\n/)) {
		content = content.replace(/,?\s*createdAt:\s*timestamp,?\s*\n/g, '\n');
		modified = true;
	}
	
	if (content.match(/updatedAt:\s*timestamp,?\s*\n/)) {
		content = content.replace(/,?\s*updatedAt:\s*timestamp,?\s*\n/g, '\n');
		modified = true;
	}
	
	// Pattern 4: Fix JSON.stringify for json fields (PostgreSQL doesn't need it)
	// But be careful with estimates which might still need it
	
	if (modified) {
		fs.writeFileSync(filePath, content, 'utf8');
		console.log(`✓ Fixed ${filePath}`);
	}
});

console.log('\nAll timestamp issues fixed!');

