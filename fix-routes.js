const fs = require('fs');
const path = require('path');

const files = [
	'src/app/api/leads/[id]/route.ts',
	'src/app/api/quotes/[id]/route.ts',
	'src/app/api/estimates/[id]/route.ts',
];

files.forEach(filePath => {
	const fullPath = path.join(__dirname, filePath);
	if (!fs.existsSync(fullPath)) {
		console.log(`Skipping ${filePath} - not found`);
		return;
	}
	
	let content = fs.readFileSync(fullPath, 'utf8');
	
	// Fix params type
	content = content.replace(
		/\{ params \}: \{ params: \{ id: string \} \}/g,
		'{ params }: { params: Promise<{ id: string }> }'
	);
	
	// Fix params usage
	content = content.replace(
		/const \{ id \} = params;/g,
		'const { id } = await params;'
	);
	
	// Fix variable name conflicts with session
	content = content.replace(
		/const session = await auth\.api\.getSession/g,
		'const authSession = await auth.api.getSession'
	);
	content = content.replace(
		/if \(!session\)/g,
		'if (!authSession)'
	);
	
	fs.writeFileSync(fullPath, content, 'utf8');
	console.log(`✓ Fixed ${filePath}`);
});

console.log('\nAll files updated!');

