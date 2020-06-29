export * from './types';

export { default as Greenhouse } from './greenhouse';
export { default as Lever } from './lever';
export { default as JazzAPI } from './jazzAPI';
export { default as JazzScrape } from './jazzScrape';
export { default as Workable } from './workable';
export { default as Indeed } from './indeed';
export { default as Collage } from './collage';

export enum JobBoardTypes {
  Greenhouse,
  Lever,
  JazzAPI,
  JazzScrape,
  Workable,
  Indeed,
  Collage,
}
