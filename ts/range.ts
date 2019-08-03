export default function* range({ address, count }: { address: number, count: number }) {
  for (let x = address; x < address + count; x++) {
    yield x;
  }
}
