import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import DashboardView from '@/components/DashboardView.vue'

describe('DashboardView Luxury Bento Design Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('renders the apex dock and bento grid', () => {
    const wrapper = mount(DashboardView)
    expect(wrapper.find('.apex-dock').exists()).toBe(true)
    expect(wrapper.find('.bento-grid').exists()).toBe(true)
    expect(wrapper.text()).toContain('Velocity Index')
    expect(wrapper.text()).toContain('Execution Queue')
  })

  it('adds a new goal via the vision directives input strip', async () => {
    const wrapper = mount(DashboardView)
    const goalInput = wrapper.find('.box-goals .strip-input')
    const goalForm = wrapper.find('.box-goals .input-strip')

    await goalInput.setValue('Deploy Luxury Design')
    await goalForm.trigger('submit')

    expect(wrapper.text()).toContain('Deploy Luxury Design')
  })

  it('adds a new task through the execution queue strip', async () => {
    const wrapper = mount(DashboardView)
    const taskInput = wrapper.find('.box-execution .strip-input')
    const taskForm = wrapper.find('.box-execution .input-strip')

    await taskInput.setValue('Optimize SVG radial ring')
    await taskForm.trigger('submit')

    expect(wrapper.text()).toContain('Optimize SVG radial ring')
  })

  it('switches navigation segments cleanly', async () => {
    const wrapper = mount(DashboardView)
    const segmentButtons = wrapper.findAll('.segment-pill')
    const vaultSegBtn = segmentButtons.find((btn) => btn.text().includes('Vault'))

    expect(vaultSegBtn).toBeDefined()
    await vaultSegBtn?.trigger('click')

    expect(wrapper.find('.bento-full-canvas').exists()).toBe(true)
    expect(wrapper.text()).toContain('Telemetry & Vault')
  })
})
