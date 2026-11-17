import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import DashboardView from '@/components/DashboardView.vue'

/**
 * DashboardView tests — updated for AppShell architecture.
 * Note: .apex-dock now lives in AppShell (navigation dept), NOT in DashboardView.
 * DashboardView is responsible for: bento-grid, tab views, undo toast.
 */
describe('DashboardView — Tab Router & Bento Grid', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('renders the bento grid with core cards by default', () => {
    const wrapper = mount(DashboardView)
    expect(wrapper.find('.bento-grid').exists()).toBe(true)
    expect(wrapper.text()).toContain('Velocity Index')
    expect(wrapper.text()).toContain('Execution Queue')
  })

  it('adds a new goal via the vision directives input strip', async () => {
    const wrapper = mount(DashboardView)
    const goalInput = wrapper.find('.box-goals .strip-input')
    const goalForm  = wrapper.find('.box-goals .input-strip')

    await goalInput.setValue('Deploy Luxury Design')
    await goalForm.trigger('submit')

    expect(wrapper.text()).toContain('Deploy Luxury Design')
  })

  it('adds a new task through the execution queue strip', async () => {
    const wrapper = mount(DashboardView)
    const taskInput = wrapper.find('.box-execution .strip-input')
    const taskForm  = wrapper.find('.box-execution .input-strip')

    await taskInput.setValue('Optimize SVG radial ring')
    await taskForm.trigger('submit')

    expect(wrapper.text()).toContain('Optimize SVG radial ring')
  })

  it('switches to Vault tab view when store tab is set', async () => {
    const wrapper = mount(DashboardView)
    // Navigation is now in AppShell/MobileBottomNav — trigger via store directly
    const { useTasksStore } = await import('@/store/tasks')
    const store = useTasksStore()
    store.setTab('database')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.bento-grid').exists()).toBe(false)
  })
})
