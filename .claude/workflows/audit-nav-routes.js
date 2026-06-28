export const meta = {
  name: 'audit-nav-routes',
  description: 'Audit all 6 navigation routes for bugs and performance issues',
  phases: [
    { title: 'Scan', detail: 'One agent per route — find bugs, perf issues, code smells' },
    { title: 'Verify', detail: 'Adversarially verify each finding' },
    { title: 'Report', detail: 'Synthesize confirmed issues into actionable report' },
  ],
}

const ROUTES = [
  { name: 'Home (/)', page: 'app/src/pages/Home.jsx', desc: 'Landing page with EarthquakeMap, hero, recent quakes' },
  { name: 'About (/about)', page: 'app/src/pages/About.jsx', desc: 'About page with team info' },
  { name: 'Recovery (/recovery)', page: 'app/src/pages/Recovery.jsx', desc: 'Recovery resources page' },
  { name: 'Donate (/donate)', page: 'app/src/pages/Donate.jsx', desc: 'Donation page' },
  { name: 'Quiz (/quiz)', page: 'app/src/pages/Quiz.jsx', desc: 'Earthquake safety quiz' },
  { name: 'History (/history)', page: 'app/src/pages/History.jsx', desc: 'Historical earthquakes page' },
]

// Phase 1: Scan all routes in parallel
phase('Scan')
const findings = await pipeline(
  ROUTES,
  route => agent(
    `Audit the route "${route.name}" for bugs and performance issues.

The main page component is at: ${route.page}
Description: ${route.desc}

The project is a React + MUI + Leaflet app (React Router v7, framer-motion, @tanstack/react-query).

Read the page file AND all components it imports from app/src/components/. Look for:

BUGS:
- Missing keys on lists
- Undefined/null access without guards
- Stale closures in useEffect/useCallback
- Memory leaks (intervals/subscriptions not cleaned up)
- Incorrect dependency arrays in hooks
- State updates on unmounted components
- Race conditions in async operations
- Broken navigation or missing routes

PERFORMANCE:
- Unnecessary re-renders (missing useMemo/useCallback/memo)
- Large bundles or heavy imports that could be lazy-loaded
- Inline function/object/array literals in JSX props (cause re-renders)
- Missing React.memo on expensive sub-components
- Images/assets not optimized
- Fetching without caching (missing staleTime, no react-query)
- Animations running on layout-triggering properties (width, height, top, left)

CODE QUALITY:
- Dead code or unused imports
- Inconsistent patterns vs the rest of the codebase
- Accessibility issues (missing aria labels, keyboard nav)
- Console.log left in production code

Return your findings as a JSON object with this structure:
{
  "route": "${route.name}",
  "findings": [
    {
      "title": "short title",
      "severity": "high|medium|low",
      "category": "bug|performance|quality",
      "file": "path/to/file.jsx",
      "line": 42,
      "description": "what's wrong and why it matters",
      "fix": "suggested fix"
    }
  ]
}`,
    { label: `scan:${route.name}`, phase: 'Scan', schema: {
      type: 'object',
      properties: {
        route: { type: 'string' },
        findings: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              severity: { type: 'string', enum: ['high', 'medium', 'low'] },
              category: { type: 'string', enum: ['bug', 'performance', 'quality'] },
              file: { type: 'string' },
              line: { type: 'number' },
              description: { type: 'string' },
              fix: { type: 'string' }
            },
            required: ['title', 'severity', 'category', 'file', 'description', 'fix']
          }
        }
      },
      required: ['route', 'findings']
    }}
  )
)

// Phase 2: Verify top findings adversarially
phase('Verify')
const allFindings = findings.filter(Boolean).flatMap(r => r.findings)
const highMedium = allFindings.filter(f => f.severity === 'high' || f.severity === 'medium')
log(`Found ${allFindings.length} total issues (${highMedium.length} high/medium to verify)`)

const verified = await pipeline(
  highMedium.slice(0, 15),
  finding => agent(
    `Adversarially verify this finding. Read the actual file and check if the issue is REAL or a false positive.

Finding: "${finding.title}"
File: ${finding.file}
Line: ${finding.line}
Description: ${finding.description}

Read the file at ${finding.file} (and surrounding context). Determine:
1. Is the code actually buggy/slow, or is the finding wrong?
2. Is the severity accurate?
3. Is the suggested fix correct?

Return: { "verified": true|false, "correctedSeverity": "high|medium|low"|null, "notes": "explanation" }`,
    { label: `verify:${finding.title.slice(0, 30)}`, phase: 'Verify', schema: {
      type: 'object',
      properties: {
        verified: { type: 'boolean' },
        correctedSeverity: { type: ['string', 'null'], enum: ['high', 'medium', 'low', null] },
        notes: { type: 'string' }
      },
      required: ['verified', 'correctedSeverity', 'notes']
    }}
  )
)

// Phase 3: Synthesize report
phase('Report')
const confirmed = highMedium.slice(0, 15).map((f, i) => ({
  ...f,
  verified: verified[i]?.verified ?? false,
  correctedSeverity: verified[i]?.correctedSeverity ?? f.severity,
  verificationNotes: verified[i]?.notes ?? 'not checked'
})).filter(f => f.verified)

const lowFindings = allFindings.filter(f => f.severity === 'low')

return {
  summary: {
    totalFindings: allFindings.length,
    highMedium: highMedium.length,
    verified: confirmed.length,
    falsePositives: highMedium.slice(0, 15).length - confirmed.length,
    lowSeverity: lowFindings.length
  },
  confirmedIssues: confirmed,
  lowSeverityIssues: lowFindings.map(f => ({ title: f.title, route: f.file, category: f.category, description: f.description }))
}
