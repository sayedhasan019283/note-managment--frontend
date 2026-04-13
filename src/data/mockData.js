export const MOCK_NOTES = [
  { _id: 'n1', title: 'Project Kickoff Ideas', content: 'Need to discuss timeline with the team. Key milestones: design review by Friday, dev sprint starts Monday. Consider using a kanban board for tracking.', userId: '1', userName: 'Alex Morgan', tags: ['work', 'planning'], createdAt: '2025-04-10T09:00:00Z', updatedAt: '2025-04-10T09:00:00Z' },
  { _id: 'n2', title: 'Book Notes: Thinking Fast & Slow', content: 'System 1 vs System 2 thinking. Cognitive biases are deeply ingrained. The availability heuristic causes us to overestimate dramatic events.', userId: '1', userName: 'Alex Morgan', tags: ['reading', 'notes'], createdAt: '2025-04-08T14:30:00Z', updatedAt: '2025-04-09T10:00:00Z' },
  { _id: 'n3', title: 'Chess Opening Study', content: 'Working on the Sicilian Defense. The Najdorf variation is aggressive and complex. Need to memorize key positions up to move 15.', userId: '1', userName: 'Alex Morgan', tags: ['chess', 'hobby'], createdAt: '2025-04-07T20:00:00Z', updatedAt: '2025-04-07T20:00:00Z' },
  { _id: 'n4', title: 'Admin: System Architecture Review', content: 'Review MongoDB indexes for performance. Check aggregation pipeline efficiency. Auth middleware needs audit.', userId: '2', userName: 'Sam Rivera', tags: ['admin', 'technical'], createdAt: '2025-04-09T11:00:00Z', updatedAt: '2025-04-09T11:00:00Z' },
  { _id: 'n5', title: 'Team Standup Notes', content: 'Alice: blocked on API integration. Bob: finished auth module. Need to schedule retrospective.', userId: '2', userName: 'Sam Rivera', tags: ['work', 'team'], createdAt: '2025-04-11T08:00:00Z', updatedAt: '2025-04-11T08:00:00Z' },
  { _id: 'n6', title: 'Hiking Trail Research', content: 'Mount Rinjani looks incredible. 3-day trek, 3726m summit. Best season is April-October.', userId: '1', userName: 'Alex Morgan', tags: ['hiking', 'travel'], createdAt: '2025-04-06T16:00:00Z', updatedAt: '2025-04-06T16:00:00Z' },
]

export const MOCK_USERS = [
  { _id: '1', name: 'Alex Morgan', email: 'alex@example.com', role: 'user', avatar: 'AM', interests: ['reading', 'chess', 'hiking'], createdAt: '2025-01-15T08:00:00Z', status: 'active' },
  { _id: '2', name: 'Sam Rivera', email: 'sam@admin.com', role: 'admin', avatar: 'SR', interests: ['coding', 'music'], createdAt: '2025-01-01T08:00:00Z', status: 'active' },
  { _id: '3', name: 'Jordan Lee', email: 'jordan@example.com', role: 'user', avatar: 'JL', interests: ['chess', 'cooking'], createdAt: '2025-02-20T08:00:00Z', status: 'active' },
  { _id: '4', name: 'Morgan Chen', email: 'morgan@example.com', role: 'user', avatar: 'MC', interests: ['reading', 'travel', 'music'], createdAt: '2025-03-05T08:00:00Z', status: 'inactive' },
  { _id: '5', name: 'Casey Williams', email: 'casey@example.com', role: 'user', avatar: 'CW', interests: ['hiking', 'photography'], createdAt: '2025-03-18T08:00:00Z', status: 'active' },
]

export const MOCK_POSTS = [
  { _id: 'p1', title: 'Getting Started with MongoDB Aggregation', content: 'Aggregation pipelines are one of the most powerful features in MongoDB. They allow you to process data records and return computed results.', userId: '1', userName: 'Alex Morgan', likes: 42, createdAt: '2025-04-05T12:00:00Z' },
  { _id: 'p2', title: 'JWT Best Practices for REST APIs', content: 'When implementing JWT authentication, always use HTTPS, set reasonable expiration times, and never store sensitive data in the payload.', userId: '2', userName: 'Sam Rivera', likes: 87, createdAt: '2025-04-03T09:00:00Z' },
  { _id: 'p3', title: 'React Performance Tips', content: 'Use React.memo wisely, avoid inline function definitions in JSX, and leverage useMemo and useCallback for expensive computations.', userId: '1', userName: 'Alex Morgan', likes: 23, createdAt: '2025-04-01T15:00:00Z' },
  { _id: 'p4', title: 'Database Indexing Strategy', content: 'Only index fields you actually query. Compound indexes should match your query patterns. Over-indexing hurts write performance.', userId: '2', userName: 'Sam Rivera', likes: 61, createdAt: '2025-03-28T10:00:00Z' },
]

export const INTERESTS_DATA = [
  { interest: 'reading', users: ['Alex Morgan', 'Morgan Chen'], count: 2 },
  { interest: 'chess', users: ['Alex Morgan', 'Jordan Lee'], count: 2 },
  { interest: 'hiking', users: ['Alex Morgan', 'Casey Williams'], count: 2 },
  { interest: 'coding', users: ['Sam Rivera'], count: 1 },
  { interest: 'music', users: ['Sam Rivera', 'Morgan Chen'], count: 2 },
  { interest: 'cooking', users: ['Jordan Lee'], count: 1 },
  { interest: 'travel', users: ['Morgan Chen'], count: 1 },
  { interest: 'photography', users: ['Casey Williams'], count: 1 },
]
