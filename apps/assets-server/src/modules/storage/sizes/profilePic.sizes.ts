export interface IProfilePicSizes {
  width: number;
  height: number;
  suffix: string;
}
export const profilePicSizes: IProfilePicSizes[] = [
  { width: 128, height: 128, suffix: 'small' },
  { width: 500, height: 500, suffix: 'medium' },
  { width: 1024, height: 1024, suffix: 'original' },
];
