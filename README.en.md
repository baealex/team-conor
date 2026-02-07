[한국어](./README.md) | [日本語](./README.ja.md)

# Team Conor

A team persona system for AI coding assistants (Claude).

## Why Do You Need This?

When you develop alone, there's no code review. If you ask an AI for a review, you only get abstract advice like "write clean code" or "add error handling."

Real teams are different. A PM asks "Is this needed for the MVP?", a designer points out "Where's the loading state?", and a backend developer catches "Isn't that an N+1 query?" Each specialist raises **specific problems** with **specific solutions** from their area of expertise.

Team Conor brings this experience to your AI coding assistant. Five expert personas review your code with their own checklists and anti-pattern catalogs, and when they find issues, they suggest resolution patterns as well.

## Installation

```bash
npx team-conor
```

### CLI Options

```bash
# Interactive setup (default)
npx team-conor init

# Language selection (ko, en, ja)
npx team-conor init --lang en

# Non-interactive mode (for CI/CD or non-interactive environments)
npx team-conor init --name "John Doe" --no-interaction

# Force overwrite existing files
npx team-conor init --name "John Doe" -y

# Help
npx team-conor --help
npx team-conor init --help

# Version
npx team-conor --version
```

## Generated Files

```
CLAUDE.md                    # AI configuration file
.conor/
├── persona/                 # Team member personas
│   ├── user.md              # User (project owner)
│   ├── planner.md           # Steve (product strategy)
│   ├── pm.md                # Elon (execution PM)
│   ├── designer.md          # Marco (UX)
│   ├── frontend.md          # Yuna (Frontend)
│   └── backend.md           # Viktor (Backend)
└── memory/                  # Project context
    ├── summary.md           # Core summary (referenced by CLAUDE.md)
    ├── project.md           # Tech stack, architecture
    ├── decisions.md         # Key decision records
    └── learnings.md         # Learned patterns, bug fixes
```

## Team Composition

| Name | Role | Background | Perspective |
|------|------|------------|-------------|
| Steve | Product Strategy | Product visionary who built the first iPhone under Jobs | "Why do we need this?" - 5 Whys, user value validation |
| Elon | Execution PM | Early SpaceX member | "When will it be done?" - Scope adjustment, blocker removal, MVP focus |
| Marco | UX | Protege of Donald Norman, former Apple senior designer | "Will the user understand?" - Accessibility, feedback states, consistency |
| Yuna | Frontend | Early Chrome browser dev team, TC39 participant | "How many re-renders?" - Performance, type safety, browser-native APIs |
| Viktor | Backend | 25-year system architect, early Rust contributor | "What about 1M users?" - Scalability, data integrity, type-driven testing |

## Usage

### Calling Team Members

```
Yuna, review this component
Viktor, check this API design
Marco, is this UI accessible?
```

### Team Discussion

```
Let's have a meeting about how to implement this feature
```

### Code Tasks

```
Fix this bug  → Performs the actual work, then self-reviews from relevant persona perspectives
```

## Key Features

### Checklist-Based Review

Each persona provides feedback through specific checklists instead of abstract advice:

```
Yuna: I looked at this component...
- [ ] `user` is missing from the useEffect dependency array
- [ ] This state can be lifted to a server component
- [x] Types look good
```

### Anti-Pattern Detection

Each persona automatically detects anti-patterns in their domain:

```
Viktor: Isn't this an N+1 query? You're making DB calls inside a loop.
→ You should replace this with a JOIN or batch query.
```

### Resolution Pattern Suggestions

When pointing out issues, a resolution direction is always provided (no diagnosis-only feedback without a prescription):

```
Marco: There's no loading state, so the user will think it's frozen.
→ Apply the Skeleton UI pattern. [specific code provided]
```

### Cross-Domain Collaboration

When a related domain is detected, other personas are automatically invoked:

```
Steve: The scope of this feature is growing...
→ Elon, can you take a look at the scope management?

Elon: Let me see what we can cut to ship the MVP in half the time.
```

### Memory System

Project context is recorded in `.conor/memory/` to maintain continuity across sessions:

- **summary.md**: Core context summary (always referenced)
- **project.md**: Tech stack, architecture, conventions
- **decisions.md**: Key technical decisions and rationale
- **learnings.md**: Discovered patterns, bug fixes

### Update Support

When you run `npx team-conor` again on an already configured project:
- Shows a diff compared to existing files
- Choose to overwrite / skip / backup
- **Memory files are automatically preserved** (user data protection)

## Customization

Edit each persona file (`.conor/persona/*.md`) to:
- Add/modify checklist items
- Adjust anti-patterns and resolution patterns for your project
- Reflect your project's tech stack
- Add team conventions

## License

MIT
