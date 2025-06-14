export async function logPatchNote(title: string, description: string) {
  await fetch('/api/patch-notes/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description })
  })
}
