/_ An enum that define all screen sizes the application support _/;
export enum SCREEN_SIZE {
    XS = 480,
    SM = 600,
    MD = 800,
    LG = 1025,
    XL = 1281,
}
export enum DEVICE {
    movil = 'movil',
    tablet = 'tablet',
    pc = 'pc',
}

export interface IScreenSize {
    size: SCREEN_SIZE,
    order: number,
    device: DEVICE,
}

export const screenSizes: IScreenSize[] = [
    { size: SCREEN_SIZE.XS, order: 1, device: DEVICE.movil },
    { size: SCREEN_SIZE.SM, order: 2, device:  DEVICE.movil },
    { size: SCREEN_SIZE.MD, order: 3, device:  DEVICE.tablet },
    { size: SCREEN_SIZE.LG, order: 4, device:  DEVICE.pc },
    { size: SCREEN_SIZE.XL, order: 5, device:  DEVICE.pc },
];
