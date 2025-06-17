import { promises as fs } from 'fs'
import path from 'path'

interface RoadmapItem {
  title: string
  description: string
  status: 'planned' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  tags?: string[]
}

function groupByStatus(items: RoadmapItem[]) {
  return items.reduce<Record<RoadmapItem['status'], RoadmapItem[]>>(
    (acc, item) => {
      acc[item.status] = acc[item.status] ? [...acc[item.status], item] : [item]
      return acc
    },
    { planned: [], in_progress: [], done: [] }
  )
}

export default async function RoadmapPage() {
  const roadmapPath = path.join(process.cwd(), 'roadmap.json')
  const notesPath = path.join(process.cwd(), 'patch_notes.json')

  const [roadmapFile, notesFile] = await Promise.all([
    fs.readFile(roadmapPath, 'utf-8'),
    fs.readFile(notesPath, 'utf-8'),
  ])

  const items: RoadmapItem[] = JSON.parse(roadmapFile)
  const notes: { title: string }[] = JSON.parse(notesFile)

  const noteTitles = new Set(notes.map(n => n.title.toLowerCase()))

// Mark items as done at runtime if a patch note shares its title
const updated: RoadmapItem[] = items.map(item =>
  noteTitles.has(item.title.toLowerCase()) ? { ...item, status: 'done' } : item
)

  const groups = groupByStatus(updated)

  const statusLabels: Record<RoadmapItem['status'], string> = {
    planned: 'Planned',
    in_progress: 'In Progress',
    done: 'Done',
  }

  // Keep "Done" last regardless of object key order
  const statusOrder: RoadmapItem['status'][] = [
    'planned',
    'in_progress',
    'done',
  ]

  return (
    <main className="p-6 max-w-4xl mx-auto text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">🚧 Roadmap</h1>
      {statusOrder.map(status => (
        groups[status].length > 0 && (
          <section key={status} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{statusLabels[status]}</h2>
            {groups[status].map((item, idx) => (
              <div
                key={`${status}-${idx}`}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 mb-6 border border-gray-300 dark:border-gray-700"
              >
                <div className="text-xl font-semibold mb-2">{item.title}</div>
                <p className="mb-2">{item.description}</p>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Priority: {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                </div>
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>
        )
      ))}
    </main>
  )
}
