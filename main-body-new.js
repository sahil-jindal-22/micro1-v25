function addClassToEls(arr, className) {
  arr.forEach((el) => el.classList.add(className));
}

function removeClassFromEls(arr, className) {
  arr.forEach((el) => el.classList.remove(className));
}

document.addEventListener("DOMContentLoaded", () => {
  missionScroll();

  problemScroll();

  processScroll();

  useCaseDropdown();

  ctaBgScroll();

  mapDotsFill();

  footerLogo();

  buttonHover();

  trackImgsLoad();

  navScrollMob();

  observeDropdowns();

  handleBackButton();
});

function handleBackButton() {
  const backButton = document.querySelectorAll(".nav_back-btn");

  backButton.forEach((btn) => {
    btn.addEventListener("click", () => {
      const dropdown = btn.closest(".w--nav-dropdown-open");
      const toggle = dropdown.querySelector(".w--nav-dropdown-toggle-open");

      toggle.click();
    });
  });
}

function observeDropdowns() {
  // Select all dropdown toggle elements
  const dropdownToggles = document.querySelectorAll(".w-dropdown-toggle");

  console.log(dropdownToggles);

  dropdownToggles.forEach((toggle) => {
    const observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        console.log(1);
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          const element = mutation.target;

          if (element.classList.contains("w--open")) {
            // Set z-index of the parent element to 5
            const parent = element.parentElement;
            if (parent) {
              parent.style.zIndex = 5;
            }
          } else {
            const parent = element.parentElement;
            if (parent) {
              parent.style.zIndex = "";
            }
          }
        }
      });
    });

    // Configure observer to watch for attribute changes
    observer.observe(toggle, { attributes: true });
  });
}

function navScrollMob() {
  const nav = document.querySelector(".nav_component");

  mm.add("(max-width: 991px)", () => {
    const t1 = gsap.timeline({
      scrollTrigger: {
        start: "top+=50",
        end: "+=1",
        onEnter: () => nav.classList.add("is-scrolled"),
        onLeaveBack: () => nav.classList.remove("is-scrolled"),
      },
    });
  });
}

function missionScroll() {
  const stickyWrapper = document.querySelector(".section_mission");
  const textEl = stickyWrapper.querySelector("h2");

  mm.add("(min-width: 992px)", () => {
    new SplitType(textEl, { types: ["chars", "words"] });

    const chars = textEl.querySelectorAll(".char");

    gsap
      .timeline({
        scrollTrigger: {
          trigger: stickyWrapper,
          start: "top top",
          end: "+=100%",
          scrub: true,
          pin: true,
          ease: "power1.inOut",
        },
      })
      .from(
        chars,
        {
          opacity: 0.2,
          stagger: 0.1,
        },
        "<"
      );

    return () => {
      // optional
      // custom cleanup code here (runs when it STOPS matching)
    };
  });

  // later, if we need to revert all the animations/ScrollTriggers...
  // mm.revert();
}

function processScroll() {
  const component = document.querySelector(".process_component");
  const wrapper = component.querySelector(".process_wrapper");
  const imgListWrap = component.querySelector(".process_img-list");
  const textList = [...component.querySelectorAll(".process_text")];
  const imgList = gsap.utils.toArray(".process_img-wrapper");

  let activeElement;

  mm.add("(min-width: 992px)", () => {
    textList[0].classList.add("is-active");

    const t1 = gsap.timeline({});

    t1.to(imgListWrap, {
      y: -imgListWrap.offsetHeight + imgList[0].offsetHeight,
      duration: 1,
      ease: "power1.inOut",
    });

    ScrollTrigger.create({
      animation: t1,
      trigger: component,
      start: "top top",
      end: () => "+=" + (window.innerHeight + imgListWrap.offsetHeight),
      scrub: true,
      pin: wrapper,
      // markers: true,
      onUpdate: (self) => {
        const segments = 4; // Change this number as needed (3, 4, 5, etc.)
        const progress = self.progress.toFixed(1);

        const segmentSize = 1 / segments;
        const currentSegment = Math.floor(progress / segmentSize);

        // Ensure currentSegment doesn't exceed array bounds
        const segmentIndex = Math.min(currentSegment, segments - 1);

        if (activeElement === segmentIndex) return;

        // console.log(activeElement === segmentIndex, activeElement, segmentIndex);

        updateActiveText(segmentIndex);

        activeElement = segmentIndex;
      },
    });
  });

  function updateActiveText(index) {
    textList.forEach((text) => text.classList.remove("is-active"));

    const textWrap = textList[index];

    // console.log(textList, textWrap);
    textWrap.classList.add("is-active");
  }
}

function problemScroll() {
  const section = document.querySelector(".section_problem");
  const mainSticky = section.querySelector(".problem_bottom-wrap");
  const listWrap = section.querySelector(".problem_list");
  const list = section.querySelectorAll(".problem_text-item");
  const listIcon = section.querySelectorAll(".problem_icon");

  const heading = section.querySelector(".problem_heading");
  const h1s = heading.querySelectorAll("h1");
  const headingPlaceholder = section.querySelector(
    ".problem_heading-placeholder"
  );
  const topSticky = section.querySelector(".problem_top");
  const globe = section.querySelector(".problem_globe");

  mm.add("(min-width: 992px)", () => {
    const state = Flip.getState([heading, h1s], {
      props: "fontSize,display",
    });

    headingPlaceholder.appendChild(heading);
    heading.classList.add("is-moved");

    const headingTimeline = Flip.from(state, {
      duration: 1,
      ease: "power1.inOut",
      paused: true,
      nested: true,
    }).fromTo(
      globe,
      {
        opacity: 1,
        scale: 1,
      },
      {
        opacity: 0,
        duration: 0.5,
        scale: 0.5,
      },
      0
    );

    ScrollTrigger.create({
      animation: headingTimeline,
      // markers: true,
      trigger: topSticky,
      start: "top top",
      end: "bottom top",
      scrub: true,
    });

    const mainTimeline = gsap.timeline({});

    mainTimeline.to(listWrap, {
      y: -listWrap.offsetHeight + list[0].offsetHeight,
      duration: 1,
      ease: "power1.inOut",
    });

    mainTimeline.addLabel("first", 0);
    mainTimeline.addLabel("second", 0.3);
    mainTimeline.addLabel("third", 0.6);

    mainTimeline.to(listIcon[0], { opacity: 1, duration: 0 }, "first");
    mainTimeline.to(listIcon[1], { opacity: 1, duration: 0 }, "second");
    mainTimeline.to(listIcon[2], { opacity: 1, duration: 0 }, "third");

    let activeElement;

    ScrollTrigger.create({
      animation: mainTimeline,
      trigger: mainSticky,
      start: "top top",
      end: () => "+=" + (window.innerHeight + listWrap.offsetHeight * 0.8),
      scrub: true,
      pin: true,
      // markers: true,
      onUpdate: (self) => {
        const segments = 4; // Change this number as needed (3, 4, 5, etc.)
        const progress = self.progress.toFixed(1);

        const segmentSize = 1 / segments;
        const currentSegment = Math.floor(progress / segmentSize);

        // Ensure currentSegment doesn't exceed array bounds
        const segmentIndex = Math.min(currentSegment, segments - 1);

        if (activeElement === segmentIndex) return;

        // console.log(activeElement === segmentIndex, activeElement, segmentIndex);

        // updateActiveText(segmentIndex);

        activeElement = segmentIndex;
      },
    });
  });
}

// function textScroll() {
//   const textEls = document.querySelectorAll("[data-animation='split-text']");
//   if (!textEls.length) return;

//   textEls.forEach((textEl) => {
//     let typeSplit, lines;
//     // Split the text up
//     function runSplit() {
//       typeSplit = new SplitType(textEl, {
//         types: "lines, words",
//       });

//       lines = textEl.querySelectorAll(".line");

//       lines.forEach((line) =>
//         line.insertAdjacentHTML("afterbegin", "<div class='line-mask'></div>")
//       );
//       createAnimation();
//     }
//     runSplit();
//     // Update on window resize
//     let windowWidth = $(window).innerWidth();
//     window.addEventListener("resize", function () {
//       if (windowWidth !== $(window).innerWidth()) {
//         windowWidth = $(window).innerWidth();
//         typeSplit.revert();
//         runSplit();
//       }
//     });

//     function createAnimation() {
//       lines.forEach(function (line) {
//         let tl = gsap.timeline({
//           scrollTrigger: {
//             trigger: line,
//             start: "top 60%",
//             end: "bottom 60%",
//             scrub: 1,
//           },
//         });
//         tl.to(line.querySelector(".line-mask"), {
//           width: "0%",
//           duration: 1,
//         });
//       });
//     }
//   });
// }

function useCaseDropdown() {
  const links = document.querySelectorAll(".nav_dd_p-item");
  const lists = document.querySelectorAll(".nav_dd_c-list");
  const listContainer = document.querySelector(".nav_dd_c-col");

  if (!(window.innerWidth > 991)) return;

  console.log(5);
  links.forEach((link, i) =>
    link.addEventListener("mouseenter", () => {
      // addClassToEls(lists, "hide");
      // lists[i].classList.remove("hide");
      removeClassFromEls(links, "is-selected");
      link.classList.add("is-selected");
      listContainer.innerHTML = "";
      listContainer.insertAdjacentElement("afterbegin", lists[i]);
    })
  );

  links[0].classList.add("is-selected");
  listContainer.insertAdjacentElement("afterbegin", lists[0]);
}

function ctaBgScroll() {
  const img = document.querySelector(".cta_bg-img");
  const wrapper = document.querySelector(".cta_wrapper");

  const imgParalax = gsap.to(img, {
    yPercent: 20,
    duration: 1,
    ease: "power1.inOut",
  });

  ScrollTrigger.create({
    trigger: wrapper,
    start: "top bottom",
    end: "bottom top",
    animation: imgParalax,
    scrub: 1,
  });
}

function mapDotsFill() {
  const wrap = document.querySelectorAll(".bg-map_dots-wrap");

  wrap.forEach((wrap) => {
    const images = wrap.querySelectorAll(".bg-map_dots-img");

    wrap.dataset.activeIndex = 0;
    images[0].style.opacity = 1;

    const showNext = () => {
      const activeIndex = +wrap.dataset.activeIndex;
      let nextIndex;

      if (images.length - 1 === +wrap.dataset.activeIndex) {
        console.log("reached last");
        nextIndex = 1;
      } else nextIndex = activeIndex + 1;

      const activeEl = images[activeIndex];
      const nextEl = images[nextIndex];

      console.log(activeEl, nextEl);

      activeEl.style.opacity = 0;

      setTimeout(() => {
        nextEl.style.opacity = 1;
      }, 1000);

      wrap.dataset.activeIndex = nextIndex;
    };

    setInterval(() => {
      if (wrap.classList.contains("is-visible")) showNext();
    }, 5000);
  });
}

function footerLogo() {
  const footerWrap = document.querySelector(".footer_logo-wrap");

  footerWrap.addEventListener("mousemove", (e) => {
    const wrapRect = footerWrap.getBoundingClientRect();

    const x = e.clientX - wrapRect.left;
    const y = e.clientY - wrapRect.top;

    gsap.to(footerWrap, {
      "--pointer-x": `${x}px`,
      "--pointer-y": `${y}px`,
      duration: 0.6,
    });
  });
}

function buttonHover() {
  const buttons = document.querySelectorAll(".button");

  buttons.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const wrapRect = btn.getBoundingClientRect();

      const x = e.clientX - wrapRect.left;
      const y = e.clientY - wrapRect.top;

      gsap.to(btn, {
        "--pointer-x": `${x}px`,
        "--pointer-y": `${y}px`,
        duration: 0.3,
      });
    });
  });
}

function trackImgsLoad() {
  const images = document.querySelectorAll("[data-track-img-load]");

  images.forEach((img) => {
    const onLoad = () => {
      console.log("loaded");
      img.classList.add("loaded");
      img.parentElement.classList.add("loaded");
    };

    if (img.complete) {
      onLoad();
    } else {
      img.addEventListener("load", onLoad);
    }
  });
}
