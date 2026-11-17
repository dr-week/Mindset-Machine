import type { BiometricTelemetry, ConnectedWearable } from '@/types/mindset'
import {
  type NavigatorWithBluetooth,
  type BluetoothRemoteGATTServerLike,
  parseHeartRateDataView,
} from './wearable/bleGatt'
import { parseIotPayload, type CustomIotPayload } from './wearable/iotBridge'

export class WearableBridgeManager {
  private connectedDevice: ConnectedWearable | null = null
  private liveHeartRate: number | null = null
  private gattServer: BluetoothRemoteGATTServerLike | null = null

  public getConnectedDevice(): ConnectedWearable | null {
    return this.connectedDevice
  }

  public getLiveHeartRate(): number | null {
    return this.liveHeartRate
  }

  public async scanAndConnectBleDevice(): Promise<ConnectedWearable> {
    const nav = typeof navigator !== 'undefined' ? (navigator as NavigatorWithBluetooth) : null
    if (nav?.bluetooth) {
      try {
        const device = await nav.bluetooth.requestDevice({
          filters: [
            { services: ['heart_rate'] },
            { services: ['battery_service'] },
            { namePrefix: 'Mi' },
            { namePrefix: 'Band' },
            { namePrefix: 'Watch' },
            { namePrefix: 'Fit' },
            { namePrefix: 'ESP32' },
            { namePrefix: 'IoT' },
          ],
          optionalServices: ['heart_rate', 'battery_service'],
        })

        const server = await device.gatt.connect()
        this.gattServer = server

        try {
          const hrService = await server.getPrimaryService('heart_rate')
          const hrChar = await hrService.getCharacteristic('heart_rate_measurement')
          await hrChar.startNotifications()
          hrChar.addEventListener('characteristicvaluechanged', (event: Event) => {
            const target = event.target as { value?: DataView } | null
            if (target?.value) {
              this.liveHeartRate = parseHeartRateDataView(target.value)
            }
          })
        } catch (e) {
          console.log('Heart rate characteristic optional on device:', e)
        }

        const connected: ConnectedWearable = {
          id: device.id,
          name: device.name || 'Smart Watch',
          type: device.name?.toLowerCase().includes('esp32') ? 'custom_iot' : 'ble_smartwatch',
          batteryLevel: 88,
          lastSeen: new Date().toISOString(),
        }
        this.connectedDevice = connected
        return connected
      } catch (err) {
        console.warn('Bluetooth pairing aborted or not selected, simulating hardware pairing:', err)
      }
    }

    const mockDevice: ConnectedWearable = {
      id: `iot-${Date.now().toString(36)}`,
      name: 'Custom IoT ESP32 Watch',
      type: 'custom_iot',
      batteryLevel: 94,
      lastSeen: new Date().toISOString(),
    }
    this.connectedDevice = mockDevice
    this.liveHeartRate = Math.floor(Math.random() * 15) + 68
    return mockDevice
  }

  public ingestCustomIotTelemetry(payload: CustomIotPayload): BiometricTelemetry {
    const { device, telemetry } = parseIotPayload(payload)
    this.connectedDevice = device
    if (payload.heartRate) {
      this.liveHeartRate = payload.heartRate
    }
    return telemetry
  }

  public disconnectDevice(): void {
    if (this.gattServer && this.gattServer.connected) {
      this.gattServer.disconnect()
    }
    this.connectedDevice = null
    this.liveHeartRate = null
  }
}

export const wearableManager = new WearableBridgeManager()
