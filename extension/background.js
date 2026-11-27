// Mindset Machine Companion Background Service Worker (Manifest V3)

const STORAGE_KEY = 'mindset_extension_tasks'

chrome.runtime.onInstalled.addListener(() => {
  // Create Context Menu for quick web capture
  chrome.contextMenus.create({
    id: 'mindset-capture-selection',
    title: 'Add "%s" to Mindset Focus Stream',
    contexts: ['selection']
  })

  // Initial badge update
  updateBadgeFromStorage()
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'mindset-capture-selection' && info.selectionText) {
    chrome.storage.local.get([STORAGE_KEY], (res) => {
      const tasks = res[STORAGE_KEY] || []
      const newTask = {
        id: 'web-' + Date.now(),
        title: info.selectionText.trim().substring(0, 100),
        completed: false,
        sourceUrl: tab ? tab.url : undefined,
        createdAt: new Date().toISOString(),
        microSteps: []
      }
      chrome.storage.local.set({ [STORAGE_KEY]: [newTask, ...tasks] }, () => {
        updateBadgeFromStorage()
      })
    })
  }
})

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'updateBadge') {
    const text = message.count > 0 ? String(message.count) : ''
    chrome.action.setBadgeText({ text })
    chrome.action.setBadgeBackgroundColor({ color: '#ff5722' })
  }
})

function updateBadgeFromStorage() {
  chrome.storage.local.get([STORAGE_KEY], (res) => {
    const tasks = res[STORAGE_KEY] || []
    const count = tasks.filter(t => !t.completed).length
    const text = count > 0 ? String(count) : ''
    chrome.action.setBadgeText({ text })
    chrome.action.setBadgeBackgroundColor({ color: '#ff5722' })
  })
}
