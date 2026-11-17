export interface BluetoothRemoteGATTServerLike {
  connected: boolean
  disconnect(): void
  getPrimaryService(service: string): Promise<BluetoothRemoteGATTServiceLike>
}

export interface BluetoothRemoteGATTServiceLike {
  getCharacteristic(characteristic: string): Promise<BluetoothRemoteGATTCharacteristicLike>
}

export interface BluetoothRemoteGATTCharacteristicLike {
  startNotifications(): Promise<BluetoothRemoteGATTCharacteristicLike>
  addEventListener(type: string, listener: (event: Event) => void): void
  value?: DataView
}

export interface BluetoothDeviceLike {
  id: string
  name?: string
  gatt: {
    connect(): Promise<BluetoothRemoteGATTServerLike>
  }
}

export interface NavigatorWithBluetooth extends Navigator {
  bluetooth?: {
    requestDevice(options: {
      filters?: Array<{ services?: string[]; namePrefix?: string }>
      optionalServices?: string[]
    }): Promise<BluetoothDeviceLike>
  }
}

export function parseHeartRateDataView(value: DataView): number {
  const flags = value.getUint8(0)
  const rate16Bits = flags & 0x1
  if (rate16Bits) {
    return value.getUint16(1, true)
  }
  return value.getUint8(1)
}
