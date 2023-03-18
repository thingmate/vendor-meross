export interface IMerossElectricityConsumption {
  date: string; // format: 'Y-m-d' => '2023-01-31'
  time: number; // timestamp in seconds
  value: number; // power in watt hours
}
