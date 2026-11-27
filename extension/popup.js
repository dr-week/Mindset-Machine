// Mindset Machine Companion Popup Script
const STORAGE_KEY = 'mindset_extension_tasks'

const defaultTasks = [
  {
    id: 't-1',
    title: 'Review Zuari 5-Plane UI System',
    completed: false,
    microSteps: [
      { id: 'ms-1', title: 'Verify Surface & Dock planes', completed: true },
      { id: 'ms-2', title: 'Confirm Google Cloud Drawer', completed: false }
    ]
  },
  {
    id: 't-2',
    title: 'Test Google Drive LWW Hybrid Sync',
    completed: false,
    microSteps: [
      { id: 'ms-3', title: 'Verify drive.file folder creation', completed: false }
    ]
  }
]

function getStorage(callback) {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get([STORAGE_KEY], (res) => {
      callback(res[STORAGE_KEY] || defaultTasks)
    })
  } else {
    const raw = localStorage.getItem(STORAGE_KEY)
    callback(raw ? JSON.parse(raw) : defaultTasks)
  }
}

function setStorage(tasks, callback) {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.set({ [STORAGE_KEY]: tasks }, () => {
      if (chrome.runtime && chrome.runtime.sendMessage) {
        chrome.runtime.sendMessage({ action: 'updateBadge', count: tasks.filter(t => !t.completed).length })
      }
      if (callback) callback()
    })
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    if (callback) callback()
  }
}

function render() {
  getStorage((tasks) => {
    const listEl = document.getElementById('task-list')
    const countEl = document.getElementById('task-count')
    const activeTasks = tasks.filter(t => !t.completed)
    countEl.textContent = activeTasks.length

    listEl.innerHTML = ''
    if (tasks.length === 0) {
      listEl.innerHTML = '<div style="color: #666; font-size: 11px; text-align: center; padding: 16px;">Queue is clear. Focus on deep monk-mode.</div>'
      return
    }

    tasks.forEach((task) => {
      const card = document.createElement('div')
      card.className = 'task-card'

      const main = document.createElement('div')
      main.className = 'task-main'

      const check = document.createElement('input')
      check.type = 'checkbox'
      check.className = 'task-check'
      check.checked = task.completed
      check.addEventListener('change', () => toggleTask(task.id))

      const name = document.createElement('span')
      name.className = 'task-name' + (task.completed ? ' done' : '')
      name.textContent = task.title

      main.appendChild(check)
      main.appendChild(name)
      card.appendChild(main)

      if (task.microSteps && task.microSteps.length > 0) {
        const subList = document.createElement('div')
        subList.className = 'sub-step-list'
        task.microSteps.forEach((ms) => {
          const row = document.createElement('div')
          row.className = 'sub-step-row'

          const msCheck = document.createElement('input')
          msCheck.type = 'checkbox'
          msCheck.checked = ms.completed
          msCheck.addEventListener('change', () => toggleMicroStep(task.id, ms.id))

          const msLabel = document.createElement('span')
          msLabel.style.textDecoration = ms.completed ? 'line-through' : 'none'
          msLabel.textContent = ms.title

          row.appendChild(msCheck)
          row.appendChild(msLabel)
          subList.appendChild(row)
        })
        card.appendChild(subList)
      }

      listEl.appendChild(card)
    })
  })
}

function toggleTask(id) {
  getStorage((tasks) => {
    const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    setStorage(updated, render)
  })
}

function toggleMicroStep(taskId, stepId) {
  getStorage((tasks) => {
    const updated = tasks.map(t => {
      if (t.id !== taskId) return t
      return {
        ...t,
        microSteps: (t.microSteps || []).map(ms => ms.id === stepId ? { ...ms, completed: !ms.completed } : ms)
      }
    })
    setStorage(updated, render)
  })
}

document.getElementById('add-task-form').addEventListener('submit', (e) => {
  e.preventDefault()
  const input = document.getElementById('task-title')
  const title = input.value.trim()
  if (!title) return

  getStorage((tasks) => {
    const newTask = {
      id: 'ext-' + Date.now(),
      title,
      completed: false,
      microSteps: []
    }
    setStorage([newTask, ...tasks], () => {
      input.value = ''
      render()
    })
  })
})

document.addEventListener('DOMContentLoaded', render)
