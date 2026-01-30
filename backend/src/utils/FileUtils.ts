export default class FileUtils {
  static sizeInMb(base: string): number {
    return (base.length * (3 / 4)) / (1024 * 1024)
  }

  static imageLessThanMaxSize(base: string, maxSizeInMb: number): boolean {
    const sizeInMb = this.sizeInMb(base)
    return sizeInMb <= maxSizeInMb
  }
}
