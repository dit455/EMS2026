import {
  carouselSlides,
  downloadLinks,
  institution,
  studentHighlights,
} from '../data/portalData';

const wait = (value) => new Promise((resolve) => {
  window.setTimeout(() => resolve(value), 100);
});

export const portalService = {
  getHomeData: () => wait({
    institution,
    carouselSlides,
    studentHighlights,
    downloadLinks,
  }),
};
