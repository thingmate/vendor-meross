export interface IMerossElectricityConsumption {
  readonly date: string; // format: 'Y-m-d' => '2023-01-31'
  readonly time: number; // timestamp in seconds
  readonly value: number; // power in watt hours
}
