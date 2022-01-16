'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const mainTab = document.querySelector('.operations__tab-container');
const allTabs = document.querySelectorAll('.operations__tab');
const allContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Selecting a dom element

const header = document.querySelector('.header');

//  we Cant select it here!! -> the class has been created later
// const btnCloseCookie = document.querySelector('.btn--close--cookie');

// creating a dom element

const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML = `We are using cookie for your own benifit<button class = "btn btn--close--cookie">Got it!</button>`;

// inserting it in the webpage

header.append(message);

//  deleting a dom

document
  .querySelector('.btn--close--cookie')
  .addEventListener('click', function () {
    message.remove();
  });

// styles
message.style.backgroundColor = '#0f161c';
message.style.width = '105%';
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 20 + 'px';

// document.documentElement.style.setProperty('--color-primary', '#910291');

///////////////////////////////////////////////////
// smooth scrolling

const btnscroll = document.querySelector('.btn--scroll-to');
const s1 = document.querySelector('#section--1');
const s1coord = s1.getBoundingClientRect();
btnscroll.addEventListener('click', function (e) {
  // OLD SCHOOL METHOD -> HOING TO THE COORDINATES
  // window.scrollTo(
  //   s1coord.left + window.pageXOffset,
  //   s1coord.top + window.pageYOffset
  // );

  // NEW METHOD

  s1.scrollIntoView({ behavior: 'smooth' });
});

//  rgb(255,255,255)
////////////////////////////////////////////

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// event Delegation

//  common parent ->add event listner

document.querySelector('.nav__links').addEventListener('click', function (e) {
  if (e.target.classList.contains('nav__link')) {
    // to avoid clicks
    e.preventDefault();
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// implementing tabbed component

mainTab.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return;

  // removing the exisitng styles

  allTabs.forEach(t => t.classList.remove('operations__tab--active'));

  // removing the visibility of all contents

  allContent.forEach(c => c.classList.remove('operations__content--active'));

  // making the styles active only for the tab we clicked

  clicked.classList.add('operations__tab--active');

  // making the visibility for the content we want

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//  Implementing howeing in the main tab

const HowerOver = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('nav').querySelectorAll('.nav__link');
    const logo = link.closest('nav').querySelector('.nav__logo');
    // console.log('\nlink :', link, '\nSibilings : ', siblings, '\nLogo :', logo);

    siblings.forEach(l => {
      if (l !== link) l.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', HowerOver.bind(0.5));
nav.addEventListener('mouseout', HowerOver.bind(1));

//  adding sticky class

// window.addEventListener('scroll', function () {
//   console.log(s1coord.top, window.scrollY);
//   if (window.scrollY > s1coord.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

//  sticky navigation : intersection API

// const obsfunction = function (entries, observer) {
//   entries.forEach(entry => console.log(entry));
// };

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2], // 1 is impossible as section 1 is bigger than the viewport
// };

// const observer = new IntersectionObserver(obsfunction, obsOptions);

// observer.observe(s1);

// Once the header leaves the viwport the nav bar should be sticky

const navHeight = nav.clientHeight;

const stickyNav = function (entries) {
  const entry = entries[0];
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

//  reveal sections

const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const entry = entries[0];
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const revealObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  revealObserver.observe(section);
  section.classList.add('section--hidden');
});

//  lazy loading

const allImages = document.querySelectorAll('img[data-src]');

const lazyload = function (entries, observer) {
  const entry = entries[0];

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const ImgLoad = new IntersectionObserver(lazyload, {
  root: null,
  threshold: 0,
});

allImages.forEach(img => ImgLoad.observe(img));

//  slider implementation

const allSliders = document.querySelectorAll('.slide');
const btnright = document.querySelector('.slider__btn--right');
const btnleft = document.querySelector('.slider__btn--left');

let currentslide = 0;
const maxLength = allSliders.length;

//  implementing DOTS

const dots = document.querySelector('.dots');

const addingDots = function () {
  allSliders.forEach((_, i) => {
    dots.insertAdjacentHTML(
      'beforeend',
      `<button class = "dots__dot" data-slide = "${i}"></button>`
    );
  });
};

addingDots();

const activatingDots = function (slide) {
  document.querySelectorAll('.dots__dot').forEach(dot => {
    dot.classList.remove('dots__dot--active');
  });

  document
    .querySelector(`.dots__dot[data-slide = "${slide}"]`)
    .classList.add('dots__dot--active');
};

activatingDots(0);
dots.addEventListener('click', function (e) {
  const slide = e.target.dataset.slide;

  // console.log(e.target, slide, e.target.classList.contains('dots__dot'));

  if (e.target.classList.contains('dots__dot')) goToSlide(slide);
});

const goToSlide = function (slide) {
  allSliders.forEach((s, i) => {
    s.style.transform = `translateX(${(i - slide) * 100}%)`;
  });

  activatingDots(slide);
};

goToSlide(0);
// going to the next slide

const nextSlide = function () {
  if (currentslide === maxLength - 1) currentslide = 0;
  else currentslide++;

  goToSlide(currentslide);
};

btnright.addEventListener('click', nextSlide);

// going to the previous slide

const previousSlide = function () {
  if (currentslide == 0) currentslide = maxLength - 1;
  else currentslide--;

  goToSlide(currentslide);
};
btnleft.addEventListener('click', previousSlide);

// moving around the slides with KeyBoard

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') nextSlide();
  else if (e.key === `ArrowLeft`) previousSlide();
});
