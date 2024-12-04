// initiate custom tracking object
const customTrackData = {
  utm: {},
  user: {},
};

const getCookieValue = (name) =>
  document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || "";

const createCookie = (name, data, stringify = false, expiry = 30) => {
  const expireTime = new Date();
  expireTime.setDate(expireTime.getDate() + expiry);

  document.cookie = `${name}=${encodeURIComponent(
    stringify ? JSON.stringify(data) : data
  )}; path=/; expires=${expireTime}`;
};

const loadScript = function (src, defer = false) {
  return new Promise((resolve) => {
    const scriptEl = document.createElement("script");
    if (defer) scriptEl.defer = true;
    else scriptEl.async = true;
    scriptEl.src = src;
    scriptEl.type = "text/javascript";

    document.body.appendChild(scriptEl);

    scriptEl.addEventListener("load", () => {
      resolve();
    });
  });
};

// Get user info from cookie
(() => {
  const userContactInfoCookie = getCookieValue("userContactInfo");

  if (!userContactInfoCookie) return;

  const userContactInfo = JSON.parse(decodeURIComponent(userContactInfoCookie));

  customTrackData.user = {
    first_name: userContactInfo.firstName,
    last_name: userContactInfo.lastName,
    email: userContactInfo.email,
  };
})();

function isfreeEmail(emailDomain) {
  const freeEmails = [
    "gmail.com",
    "yahoo.com",
    "icloud.com",
    "proton.me",
    "hotmail.com",
    "googlemail.com",
    "outlook.com",
    "yahoo.co.in",
  ];

  return freeEmails.includes(emailDomain);
}

let addCustomDemoRedirection = false;

// async function preFillUserData() {
//   const meetingEl = document.querySelector(".meetings-iframe-container");
//   if (!meetingEl) return;

//   const user = customTrackData.user;
//   if (!user.first_name || !user.last_name || !user.email) {
//     loadScript(
//       "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js"
//     );
//     return;
//   }
//   const userFormatted = {
//     ...(user.first_name && { firstName: user.first_name }),
//     ...(user.last_name && { lastName: user.last_name }),
//     ...(user.email && { email: user.email }),
//   };

//   let emailDomain = user.email.split("@")[1];

//   console.log(emailDomain);

//   if (!isfreeEmail(emailDomain)) {
//     try {
//       const response = await fetch(
//         `https://hook.us1.make.com/2njg45osy3rj9j8m2xxo0yiihqgmu0l2?domain=${emailDomain}`
//       );
//       console.log(response);

//       if (!response.ok) throw new Error("Error");

//       const data = await response.text();

//       console.log(data);

//       const ownerObj = {
//         will: {
//           id: "360911412",
//           url: "https://meetings.hubspot.com/micro1/meet-with-will?embed=true",
//         },
//         maria: {
//           id: "363497094",
//           url: "https://meetings.hubspot.com/mmaron?embed=true",
//         },
//         jess: {
//           id: "735983494",
//           url: "https://meetings.hubspot.com/jessica-haynes?embed=true",
//         },
//       };

//       if (data == ownerObj.will.id) {
//         meetingEl.dataset.src = ownerObj.will.url;
//         addCustomDemoRedirection = true;
//       }
//       if (data == ownerObj.maria.id) {
//         meetingEl.dataset.src = ownerObj.maria.url;
//         addCustomDemoRedirection = true;
//       }
//       if (data == ownerObj.jess.id) {
//         meetingEl.dataset.src = ownerObj.jess.url;
//         addCustomDemoRedirection = true;
//       }
//     } catch (error) {
//       console.log("make error", error);
//     }
//   }

//   const paramsStr = new URLSearchParams(userFormatted).toString();

//   console.log(paramsStr);

//   meetingEl.dataset.src += `&${paramsStr}`;

//   loadScript(
//     "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js"
//   );
// }

/* head code above */

// Global Helper Functions
// Utilites
(() => {
  // Open the first FAQ
  document.querySelector(".main-faq-wrap")?.click();

  document.body.classList.add("dom-loaded");

  // document.addEventListener("DOMContentLoaded");

  // fake submit form button - static form
  (() => {
    const customSubmitButtons = document.querySelectorAll("[data-submit-form]");

    customSubmitButtons.forEach((button) => {
      const form = button.closest("form");
      if (!form) return;

      button.addEventListener("click", (e) => {
        e.preventDefault();

        const originalSubmitButton = form.querySelector('input[type="submit"]');
        if (!originalSubmitButton) return;

        originalSubmitButton.click();
      });

      form.addEventListener("submit", () => {
        button.querySelector(".button_primary-text-wrap").textContent =
          "Please wait...";
        button.disabled = true;
      });
    });
  })();

  // Manage overflow
  (() => {
    document
      .querySelectorAll(".overflow-hide")
      .forEach((el) =>
        el.addEventListener("click", () =>
          document.querySelector("body").classList.toggle("no-scroll")
        )
      );
  })();

  // GDPR Consent
  (() => {
    const consent = getCookieValue("consent");
    if (consent) return;

    const cookieEl = document.querySelector(".cookie_bar-wrapper");
    if (!cookieEl) return;

    const acceptBtn = cookieEl.querySelector(".cookie_bar-btn");
    acceptBtn.addEventListener("click", () => {
      cookieEl.style.opacity = 0;
      setTimeout(() => cookieEl.remove(), 300);

      createCookie("consent", "true", false, 180);
    });

    cookieEl.style.display = "flex";
  })();
})();

/* Tracking & Typeforms */
// Global helper variables & functions

const updateInput = (inputArr, data) =>
  [...inputArr].forEach((input) => (input.value = data));

const URLParams = new URLSearchParams(location.search);

const staging = window.location.href.includes("staging") ? true : false;

// User Tracking
(() => {
  // get hutk and pass to inputs
  (() => {
    function getUTK(deskTimeout, mobTimeout, interval) {
      const initialTime = +new Date();
      let timeout = deskTimeout;

      if (window.innerWidth < 992) timeout = mobTimeout;

      return new Promise(function promiseResolver(resolve, reject) {
        function checkUTK() {
          const currentTime = +new Date();
          if (currentTime - initialTime > timeout) return reject("");

          let utk = getCookieValue("hubspotutk");
          if (utk !== "") return resolve(utk);

          // console.log("new timer");

          setTimeout(checkUTK, interval);
        }

        checkUTK();
      });
    }

    window.addEventListener("load", async function () {
      // hutk
      let hutk = getCookieValue("hubspotutk");

      if (!hutk) {
        try {
          hutk = await getUTK(10000, 15000, 1000);
        } catch {
          hutk = "";
        }
      }

      updateInput(document.querySelectorAll(".hutk_input"), hutk);

      // console.log("Webflow UTk check ends", hutk);
    });
  })();

  // Convert social referral to UTMs
  (() => {
    const ref = document.referrer;
    const refTwitter = ref.includes("//t.co/");
    const refLinkedin = ref.includes("linkedin.com") || ref.includes("lnkd.in");

    if (!refTwitter && !refLinkedin) return;

    if (getCookieValue("utm_cookie_contact")) return;

    let refSource;
    const utm_cookie_contact = {};

    if (refTwitter) refSource = "Twitter";
    if (refLinkedin) refSource = "LinkedIn";

    utm_cookie_contact.utm_source = refSource;
    utm_cookie_contact.utm_medium = "social";
    utm_cookie_contact.utm_term = null;
    utm_cookie_contact.utm_content = null;
    utm_cookie_contact.utm_campaign = null;

    createCookie("utm_cookie_contact", utm_cookie_contact, true);
  })();

  // Track referring site
  (() => {
    let refCookie = getCookieValue("cus_ref_site");

    if (refCookie) {
      refCookie = decodeURIComponent(refCookie);

      if (
        refCookie.includes("micro1.ai") ||
        refCookie.includes("staging") ||
        refCookie.includes("meetings")
      )
        return;

      customTrackData.cusRef = refCookie;

      updateInput(document.querySelectorAll(".ref_site_input"), refCookie);
    }

    let ref = document.referrer;

    if (!ref) return;

    if (
      ref.includes("micro1.ai") ||
      ref.includes("staging") ||
      ref.includes("meetings")
    )
      return;

    const refObj = new URL(ref);

    ref = refObj.host ? refObj.host : refObj.pathname;

    createCookie("cus_ref_site", ref);

    customTrackData.cusRef = ref;
    updateInput(document.querySelectorAll(".ref_site_input"), ref);
  })();

  // Get the UTM & store as cookie
  (() => {
    const utm_source = URLParams.get("utm_source");
    const utm_campaign = URLParams.get("utm_campaign");
    const utm_medium = URLParams.get("utm_medium");
    const utm_content = URLParams.get("utm_content");
    const utm_term = URLParams.get("utm_term");

    if (utm_source || utm_campaign || utm_medium || utm_content || utm_term) {
      const curr_cookie_contact = getCookieValue("utm_cookie_contact");

      if (curr_cookie_contact) {
        const currentCookieUTM = JSON.parse(
          decodeURIComponent(curr_cookie_contact)
        );

        if (!utm_campaign && currentCookieUTM.utm_campaign) return;
      }

      const utm_cookie_contact = {};

      utm_cookie_contact.utm_source = utm_source;
      utm_cookie_contact.utm_campaign = utm_campaign;
      utm_cookie_contact.utm_medium = utm_medium;
      utm_cookie_contact.utm_content = utm_content;
      utm_cookie_contact.utm_term = utm_term;

      createCookie("utm_cookie_contact", utm_cookie_contact, true);
    }
  })();

  // Get the UTM data from cookie, & pass to forms & the global object
  (() => {
    try {
      const utm_cookie_contact = getCookieValue("utm_cookie_contact");

      if (!utm_cookie_contact) return;

      const { utm_source, utm_campaign, utm_medium, utm_content, utm_term } =
        JSON.parse(decodeURIComponent(utm_cookie_contact));

      // Pass the data to Webflow form fields
      updateInput(document.querySelectorAll(".utm_source_input"), utm_source);
      updateInput(
        document.querySelectorAll(".utm_campaign_input"),
        utm_campaign
      );
      updateInput(document.querySelectorAll(".utm_medium_input"), utm_medium);
      updateInput(document.querySelectorAll(".utm_content_input"), utm_content);
      updateInput(document.querySelectorAll(".utm_term_input"), utm_term);

      // Update the global tracking object
      customTrackData.utm = {
        utm_source,
        utm_campaign,
        utm_medium,
        utm_content,
        utm_term,
      };
    } catch (err) {
      console.error(err);
    }
  })();

  // Track First page, Current page, Last page, ref parameter
  (() => {
    // Current page
    let current_page = location.href;
    updateInput(document.querySelectorAll(".current_page_name"), current_page);

    if (current_page === "/") current_page = "/home";

    customTrackData.current_page = current_page;

    // Last page
    try {
      let last_page = decodeURIComponent(getCookieValue("last_page"));

      if (!last_page) {
        last_page = URLParams.get("last_page");
      }

      if (last_page) {
        if (last_page === "/") last_page = "/home";

        updateInput(document.querySelectorAll(".last_page_name"), last_page);

        customTrackData.last_page = last_page;
      }

      // save current page as last page after using the last page value
      createCookie("last_page", current_page);
    } catch (err) {
      console.error(err);
    }

    // First page
    (() => {
      let first_page = decodeURIComponent(getCookieValue("first_page"));

      if (!first_page) {
        first_page = URLParams.get("first_page");

        if (!first_page) first_page = document.location.href;

        if (first_page === "/") first_page = "/home";

        createCookie("first_page", first_page);
      }

      updateInput(document.querySelectorAll(".first_page_name"), first_page);

      customTrackData.first_page = first_page;
    })();

    // Ref parameter
    (() => {
      // Store ref
      const ref = URLParams.get("ref");
      if (ref) createCookie("ref", ref);

      // Get ref
      let refCookie = getCookieValue("ref");
      if (!refCookie) return;
      try {
        refCookie = decodeURIComponent(refCookie);
        updateInput(document.querySelectorAll(".ref_input"), refCookie);
        customTrackData.ref = refCookie;
      } catch {
        console.log("error");
      }
    })();
  })();
})();

// Track user contact info
(() => {
  // Format pages URLs
  let first_page, last_page;

  if (customTrackData.first_page) {
    first_page = document.createElement("a");
    first_page.href = customTrackData.first_page;
    first_page = first_page.pathname;

    if (first_page === "/") first_page = "/home";
  }
  if (customTrackData.current_page) {
    last_page = document.createElement("a");
    last_page.href = customTrackData.current_page;
    last_page = last_page.pathname;

    if (last_page === "/") last_page = "/home";
  }

  const currentPath = window.location.pathname;
  const { utm, user } = customTrackData;

  const paramsObj = {
    ...(utm.utm_campaign && { utm_campaign: utm.utm_campaign }),
    ...(utm.utm_medium && { utm_medium: utm.utm_medium }),
    ...(utm.utm_source && { utm_source: utm.utm_source }),
    ...(utm.utm_content && { utm_content: utm.utm_content }),
    ...(utm.utm_term && { utm_term: utm.utm_term }),
    ...(first_page && { first_page: first_page }),
    ...(last_page && { last_page: last_page }),
  };

  const addParamsToURLs = function (paramsObj, identifierArr) {
    const paramsStr = decodeURIComponent(
      new URLSearchParams(paramsObj).toString()
    );

    // console.log(paramsStr);

    customTrackData.portalParams = paramsStr;

    const links = [
      ...document.querySelectorAll("a[href]:not([href='#'])"),
    ].filter((link) => identifierArr.some((str) => link.href.includes(str)));

    links.forEach(
      (link) =>
        (link.href += link.href.includes("?")
          ? `&${paramsStr}`
          : `?${paramsStr}`)
    );

    return links;
  };

  // Add params to internal links
  (() => {
    const paths = ["/letter"];

    addParamsToURLs(paramsObj, paths);
  })();

  // Add params to portal links
  (() => {
    let hutk;

    hutk = getCookieValue("hubspotutk");

    // console.log(hutk);

    let deviceId;

    if (window.amplitude) {
      deviceId = amplitude.getDeviceId();
    }

    let src;

    if (currentPath.includes("ai-interview")) {
      src = "ai-interviewer";
    } else if (currentPath.includes("cor") || currentPath.includes("onboard")) {
      src = "cor";
    } else if (
      currentPath.includes("talent") ||
      currentPath.includes("/tech/") ||
      currentPath.includes("vetting")
    ) {
      src = "search-talent";
    } else {
      src = "general";
    }

    // console.log(src);

    const paramsObjPortal = {
      ...paramsObj,
      ...(user.first_name && { first_name: user.first_name }),
      ...(user.last_name && { last_name: user.last_name }),
      ...(user.email && { email: user.email }),
      ...((currentPath.includes("search-talent") ||
        currentPath.includes("thank")) && {
        meeting: "booked",
      }),
      src,
      ...(hutk && { hutk: hutk }),
      ...(customTrackData.cusRef && { ref_site: customTrackData.cusRef }),
      ...(deviceId && { deviceId }),
    };

    const domainList = [
      "client.micro1.ai",
      "dev.d3tafas16ltk5f.amplifyapp.com",
      "developer.micro1.ai",
      "dev.d1y3udqq47tapp.amplifyapp.com",
    ];

    const portalLinks = addParamsToURLs(paramsObjPortal, domainList);

    // Update portal link on staging
    portalLinks.forEach((link) => {
      const accountType = link.dataset.accountType;

      if (accountType) {
        console.log(link, "changed account type to", accountType);
        link.href = link.href.replace(`src=${src}`, `src=${accountType}`);
      }

      if (window.location.host.includes("webflow.io")) {
        link.href = link.href.replace(
          "www.client.micro1.ai",
          "dev.d1y3udqq47tapp.amplifyapp.com"
        );
        link.href = link.href.replace(
          "www.developer.micro1.ai",
          "dev.d3tafas16ltk5f.amplifyapp.com"
        );
      }
    });

    // Get user data from meeting form
    if (document.querySelector(".client-calendly-embed")) {
      window.addEventListener("message", (event) => {
        if (event.data.meetingBookSucceeded) {
          document.querySelector(
            ".meetings-iframe-container iframe"
          ).style.height = "auto";

          const { firstName, lastName, email } =
            event.data.meetingsPayload.bookingResponse.postResponse.contact;

          const userContactInfo = { firstName, lastName, email };

          createCookie("userContactInfo", userContactInfo, true);

          function setRedirection(url) {
            setTimeout(() => (window.location = url), 2500);
          }

          // Twitter conversion code
          if (window.location.pathname === "/demo") {
            twq("event", "tw-ocr68-opq75", {});

            console.log("twitter code fired general");

            setRedirection("/thank-you");
          }
          if (window.location.pathname === "/book-hiring-call") {
            twq("event", "tw-ocr68-oouue", {});

            console.log("twitter code fired talent");

            setRedirection("/search-talent");
          }
          if (window.location.pathname === "/ai-interviewer-demo") {
            twq("event", "tw-ocr68-opq61", {});

            console.log("twitter code fired ai-interviewer");

            setRedirection("/thank-you-ai-interviewer");
          }
          if (window.location.pathname === "/book-cor-demo") {
            twq("event", "tw-ocr68-opq7b", {});

            console.log("twitter code fired cor");

            setRedirection("/onboard-talent");
          }
          if (window.location.pathname === "/ai-trainers-demo") {
            twq("event", "tw-ocr68-opq7c", {});

            console.log("twitter code fired ai-trainers");

            setRedirection("/search-talent");
          }

          // set custom params
          if (email && customTrackData) {
            let numFormSubmissions = getCookieValue("numFormSubmissons");

            if (numFormSubmissions) {
              numFormSubmissions = +numFormSubmissions + 1;
            } else {
              numFormSubmissions = 1;

              fetch(
                "https://hook.us1.make.com/1c8l4ud39pmo2isaas072kr61n9skjt5",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    email,
                    properties: { customTrackData },
                  }),
                }
              );
            }

            createCookie("numFormSubmissons", numFormSubmissions, false, 90);
          }
        }
      });
    }
  })();
})();

// Custom form
(() => {
  // init form
  (() => {
    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };
    const validatePhone = (phoneObj) => {
      if (phoneObj) {
        return phoneObj.isValidNumber();
      } else return true;
    };

    const validateNumber = (input) => {
      return (
        String(input)
          .toLowerCase()
          .match(/^[0-9-+s()]*$/) && String(input).length < 25
      );
    };

    document.querySelectorAll(".forms-steps-wrapper").forEach((form) => {
      form
        .querySelectorAll(".w-condition-invisible")
        .forEach((el) => el.remove());

      let currentStep = 0;
      const mainForm = form.closest("form");
      const allSteps = form.querySelectorAll(".form-step-wrap");
      const prevButton = mainForm.querySelector("[form-element='prev-btn']");
      const nextButton = mainForm.querySelector("[form-element='next-btn']");
      const progressBar = mainForm.querySelector(".progress-bar");
      const progressText = mainForm.querySelector(".progress-text");
      const submitBtn = mainForm.querySelector(`[form-element='submit-btn']`);
      const realSubmitBtn = mainForm.querySelector(`input[type='submit']`);
      const redirectPath = mainForm.dataset.formRedirectPath;
      const formType = form.closest(".popup-form").dataset.formBlock;

      // init progress bar
      progressBar.style.position = "relative";
      progressBar.style.overflow = "hidden";
      const progress = document.createElement("div");
      progress.style.position = "absolute";
      progress.style.width = 0;
      progress.style.height = "100%";
      progress.style.backgroundColor = "#009C20";
      progress.style.transition = "all 300ms";
      progressBar.appendChild(progress);

      const phoneInput = mainForm.querySelector("input[type='tel']");
      let phoneObj;

      // if (phoneInput)
      //   window.addEventListener(
      //     "DOMContentLoaded",
      //     () => (phoneObj = initNumber(phoneInput))
      //   );
      if (phoneInput) phoneObj = initNumber(phoneInput);

      const initNumber = function (phoneInput) {
        // Phone Input Country Dropdown
        const iti = window.intlTelInput(phoneInput, {
          initialCountry: "auto",
          geoIpLookup: (callback) => {
            fetch("https://ipapi.co/json")
              .then((res) => res.json())
              .then((data) => {
                callback(data.country_code);
              })
              .catch(() => callback("us"));
          },
          utilsScript:
            "https://cdn.jsdelivr.net/npm/intl-tel-input@23.0.4/build/js/utils.js",
        });

        return iti;
      };

      // on input - remove error view
      mainForm
        .querySelectorAll(
          `input[type="text"][required], input[type="number"][required], input[type="email"][required],  input[type="tel"][required], textarea[required], .other-field-wrap input[type="text"]`
        )
        .forEach((input) =>
          input.addEventListener("input", () => {
            input.style.borderColor = "";

            const inputs =
              input.parentElement.querySelectorAll(".primary-field");

            if (inputs.length > 1) {
              if (inputs[0].value && inputs[1].value) {
                const errorView = input
                  .closest(".form-step-wrap")
                  .querySelector(".error-view");
                if (errorView) errorView.style.display = "none";
              }
            } else {
              const errorView = input
                .closest(".form-step-wrap")
                .querySelector(".error-view");
              if (errorView) errorView.style.display = "none";
            }
          })
        );

      // on submit
      mainForm.addEventListener("submit", function (e) {
        // e.preventDefault();

        console.log("submitting");

        // return;

        if (!redirectPath) return;

        setTimeout(() => {
          document.location.href = `${redirectPath}`;
        }, 2500);
      });

      function verifyStepFields() {
        let result = false;

        const formStep = allSteps[currentStep].querySelector("div");
        if (!formStep) return false;

        const skip = formStep.dataset?.skip;

        const showError = formStep.querySelector(".error-view");

        const checkboxes = formStep.querySelectorAll(
          `[type="checkbox"], [type="radio"]`
        );
        if (checkboxes.length > 0) {
          checkboxes.forEach((cb) => {
            if (cb.checked) {
              result = true;
              if (
                cb.parentElement.querySelector("span[data-other-input]") &&
                cb
                  .closest(".step-input-wrapper")
                  .querySelector(".other-field-wrap input").value === "" &&
                !skip
              ) {
                showError.querySelector(".error-text").innerText =
                  "This field is required.";
                result = false;
                const extraInput = cb
                  .closest(".step-input-wrapper")
                  .querySelector(".other-field-wrap input");

                extraInput.focus();
                extraInput.style.borderColor = "#f86567";
              }
            }
          });
        }

        const allInputFields = formStep.querySelectorAll(
          `input[type="text"][required], input[type="number"][required], input[type="email"][required],  input[type="tel"][required], textarea[required], input[type="file"][required]`
        );
        console.log(allInputFields);
        if (allInputFields.length > 0) {
          for (let i = 0; i < allInputFields.length; i++) {
            if (allInputFields[i].value === "") {
              result = false;
              allInputFields[i].style.borderColor = "#f86567";
              allInputFields[i].focus();

              if (allInputFields[1] && allInputFields[1].value == "") {
                allInputFields[1].style.borderColor = "#f86567";
                if (allInputFields[i].value !== "") {
                  allInputFields[1].focus();
                }
              }

              break;
            } else if (allInputFields[i].type === "email") {
              if (!validateEmail(allInputFields[i].value)) {
                showError.querySelector(".error-text").innerText =
                  "Please enter a valid email address.";
                result = false;
              } else {
                showError.querySelector(".error-text").innerText =
                  "Please enter your email.";
                result = true;
              }
            } else if (allInputFields[i].type === "number") {
              if (!validateNumber(allInputFields[i].value)) {
                showError.querySelector(".error-text").innerText =
                  "Please enter a valid integer value.";
                result = false;
              } else {
                showError.querySelector(".error-text").innerText =
                  "Please enter the value in number";
                result = true;
              }
            } else if (allInputFields[i].type === "tel") {
              if (!validatePhone(phoneObj)) {
                showError.querySelector(".error-text").innerText =
                  "Please enter a valid phone number.";
                result = false;
              } else {
                showError.querySelector(".error-text").innerText =
                  "Please enter your phone number.";
                result = true;
              }
            } else if (allInputFields[i].dataset?.url) {
              const urlValue = allInputFields[i].value;
              try {
                const validURL = new URL(urlValue);
                if (validURL) result = true;
              } catch (error) {
                result = false;
                showError.querySelector(".error-text").innerText =
                  "Please enter a valid URL.";
              }
            } else result = true;
          }
        }

        const fileUploading = formStep.querySelector(
          ".w-file-upload-uploading"
        );

        if (
          fileUploading &&
          getComputedStyle(fileUploading)["display"] === "block"
        ) {
          result = false;
        }

        if (skip && skip === "true") result = true;

        if (checkboxes.length && allInputFields.length) {
          if (!checkboxes[0].checked || !allInputFields[0].value)
            result = false;
        }

        if (!result && showError) showError.style.display = "block";
        if (result && showError) showError.style.display = "none";

        return result;
      }

      function showStep(number, previous = false) {
        if (!previous) {
          const currStep = allSteps[number - 1];
          const nextStep = allSteps[number];

          currStep?.classList.remove("active");
          currStep?.classList.add("prev");

          nextStep?.classList.remove("next");
          nextStep?.classList.add("active");
        } else {
          const currStep = allSteps[number + 1];
          const prevStep = allSteps[number];

          currStep?.classList.remove("active");
          currStep?.classList.add("next");

          prevStep?.classList.remove("prev");
          prevStep?.classList.add("active");
        }

        // If first step
        if (number === 0) {
          progress.style.width = "10%";
          progressText.innerText = `1/${allSteps.length}`;
          prevButton.classList.add("hide");
        } else {
          const progressValue = (
            ((number + 1) / allSteps.length) *
            100
          ).toFixed(0);
          progress.style.width = `${progressValue}%`;
          progressText.innerText = `${currentStep + 1}/${allSteps.length}`;
          prevButton.classList.remove("hide");
        }
        if (currentStep === allSteps.length - 1) {
          submitBtn.classList.remove("hide");
          nextButton.classList.add("hide");
        } else {
          submitBtn.classList.add("hide");
          nextButton.classList.remove("hide");
        }
      }

      function moveToNextStep() {
        let onlyCheckboxes;
        const formStep = allSteps[currentStep].querySelector("div");
        const hasOtherOption = formStep.dataset?.hasOtherOption;

        onlyCheckboxes = formStep.querySelectorAll(`[type="checkbox"]`);
        let checkValues = "";
        if (onlyCheckboxes.length > 0) {
          onlyCheckboxes.forEach((cb) => {
            if (cb.checked) {
              let curValue = jQuery(cb).parent().find(".checkbox-label").text();
              if (checkValues) {
                checkValues = checkValues + ", " + curValue;
              } else {
                checkValues = curValue;
              }
            }
          });

          if (hasOtherOption) {
            const customValue = formStep.querySelector(
              ".other-field-wrap input"
            )?.value;

            if (customValue) {
              checkValues = checkValues
                ? checkValues + ", " + customValue
                : customValue;
            }
          }
        }

        jQuery(formStep).find(".hidden-input").attr("value", checkValues);

        const result = verifyStepFields();
        if (!result) {
          return;
        }

        if (currentStep + 1 <= allSteps.length - 1) currentStep++;
        showStep(currentStep);
      }

      function handleKeydown(e) {
        if (e.isComposing || e.keyCode === 229) {
          return;
        }
        if (!(e.key === "Enter") && !(e.key === "Tab")) return;

        const compStyles = window.getComputedStyle(form.closest(".popup-form"));

        if (compStyles.getPropertyValue("display") == "none") {
          console.log("form not open");
          return;
        } else {
          console.log("form open");
        }

        if (e.target.classList.contains("text-area") && e.key === "Enter")
          return;

        if (e.key === "Tab") {
        }

        e.preventDefault();

        currentStep === allSteps.length - 1 ? submitForm() : moveToNextStep();
      }

      function submitForm() {
        const result = verifyStepFields();
        if (!result) return;

        console.log("ready to submit");

        submitBtn.querySelector(".button_primary-text-wrap").textContent =
          "Please wait...";

        // [data-has-other-option='radio'] .other-field-wrap input
        mainForm
          .querySelectorAll(
            ".w-checkbox:not(.checkbox_legal), [data-has-other-option='checkbox'] .other-field-wrap input, .iti__selected-country, .iti__search-input"
          )
          .forEach((el) => el.remove());

        console.log("removed");

        if (phoneInput) {
          phoneInput.value = phoneObj.getNumber();
        }

        const allFormData = new FormData(mainForm);

        if (formType === "eng") {
          const countryInput = document.querySelector(
            "input[name='Dev Country']"
          );

          if (!countryInput) return;

          const country = phoneObj.getSelectedCountryData();
          countryInput.value = country.iso2;
        } else {
          const userContactInfo = {
            firstName: allFormData.get(`${formType}-first-name`),
            lastName: allFormData.get(`${formType}-last-name`),
            email: allFormData.get(`${formType}-email`),
          };

          console.log(userContactInfo);

          createCookie("userContactInfo", userContactInfo, true);
        }

        // Twitter conversion code
        if (formType === "talent") {
          twq("event", "tw-ocr68-ooizv", {});

          console.log("twitter code fired talent");
        }
        if (formType === "rlhf") {
          twq("event", "tw-ocr68-opq5o", {});

          console.log("twitter code fired rlhf");
        }
        if (formType === "ai-interviewer") {
          twq("event", "tw-ocr68-opq5p", {});

          console.log("twitter code fired ai interviwer");
        }
        if (formType === "general") {
          twq("event", "tw-ocr68-opq1t", {});

          console.log("twitter code fired general");
        }

        if (formType !== "intern") {
          // set custom params
          let numFormSubmissions = getCookieValue("numFormSubmissons");

          if (numFormSubmissions) {
            numFormSubmissions = +numFormSubmissions + 1;
          } else {
            numFormSubmissions = 1;
          }

          createCookie("numFormSubmissons", numFormSubmissions, false, 90);
        }

        setTimeout(() => {
          realSubmitBtn.click();
        }, 300);
      }

      // Add event handlers
      submitBtn.addEventListener("click", submitForm);
      nextButton.addEventListener("click", moveToNextStep);
      document.addEventListener("keydown", handleKeydown);
      prevButton.onclick = () => {
        if (currentStep - 1 >= 0) currentStep--;
        showStep(currentStep, true);
      };
      // init
      console.log(currentStep);
      showStep(currentStep);
    });
  })();

  // logic for checkboxes and radio
  (() => {
    const allRadioInputs = document.querySelectorAll(
      ".popup-form [type='radio']"
    );

    const changeRadioInput = (input) => {
      if (input.checked) {
        input
          .closest(".step-input-wrapper")
          .querySelectorAll("[type='radio']")
          .forEach((input) => {
            input.parentElement.classList.remove("is-checked");
          });
        input.parentElement.classList.add("is-checked");
      }
    };

    allRadioInputs.forEach((input) =>
      input.addEventListener("change", () => {
        changeRadioInput(input);
      })
    );

    const allCheckboxInputs = document.querySelectorAll(
      ".popup-form [type='checkbox']:not([name='Accept-Conditions'])"
    );

    const changeCheckboxInput = (input) => {
      if (input.checked) {
        input.closest(".checkbox-wrapper").classList.add("is-checked");
      } else {
        input.closest(".checkbox-wrapper").classList.remove("is-checked");
      }
    };

    allCheckboxInputs.forEach((input) =>
      input.addEventListener("change", () => {
        changeCheckboxInput(input);
      })
    );

    const otherRadioInputs = document.querySelectorAll(
      "[data-has-other-option='radio'] [type='radio']"
    );

    otherRadioInputs.forEach((input) => {
      input.addEventListener("change", () => {
        const otherTextInputWrapper = input
          .closest(".step-input-wrapper")
          .querySelector(".other-field-wrap");
        if (
          input.parentElement.querySelector("[data-other-input='true']") !==
          null
        ) {
          const otherInputText = input.parentElement.querySelector(
            "[data-other-input='true']"
          ).dataset.otherInputText;
          otherTextInputWrapper.querySelector("input").placeholder =
            otherInputText || "Please enter here";

          otherTextInputWrapper.classList.remove("hidden");

          otherTextInputWrapper.querySelector("input").value = "";
        } else {
          otherTextInputWrapper.classList.add("hidden");
        }
      });
    });

    const otherRadioActualInputs = document.querySelectorAll(
      "[data-has-other-option='radio'] .other-field-wrap input"
    );

    otherRadioActualInputs.forEach((input) =>
      input.addEventListener("input", (e) => {
        const otherRadio = input
          .closest(".step-input-wrapper")
          .querySelector(".radio-wrapper.is-checked input");

        otherRadio.value = e.target.value;
      })
    );

    const otherCheckboxLabels = document.querySelectorAll(
      "[data-has-other-option='checkbox'] [data-other-input='true']"
    );
    const otherCheckboxInputs = Array.from(otherCheckboxLabels).map((label) =>
      label.parentElement.querySelector("[type='checkbox']")
    );

    otherCheckboxInputs.forEach((input) => {
      input.addEventListener("change", () => {
        const otherTextInputWrapper = input
          .closest(".step-input-wrapper")
          .querySelector(".other-field-wrap");
        otherTextInputWrapper.classList.toggle("hidden");
      });
    });

    const allCheckboxes = document.querySelectorAll(
      ".popup-form input[type='checkbox']:not([name='Accept-Conditions']), .popup-form input[type='radio']"
    );

    if (allCheckboxes.length > 0) {
      allCheckboxes.forEach((el) => {
        el.addEventListener("change", () => {
          const errorEl = el
            .closest(".step-input-wrapper")
            .querySelector(".error-view");
          if (errorEl && errorEl.style.display === "block")
            errorEl.style.display = "none";
        });
      });
    }
  })();

  // Form triggers
  (() => {
    // document.addEventListener("DOMContentLoaded", () => {
    (() => {
      const openTriggers = document.querySelectorAll("[data-form-cta]");

      openTriggers.forEach((trigger) => {
        const type = trigger.dataset.formCta;

        if (!type) return;

        trigger.addEventListener("click", () => {
          const form = document.querySelector(`[data-form-block='${type}']`);

          console.log(form, type);

          if (form) showForm(form);
          else console.error(`Form:${type} not found!`);
        });
      });

      function showForm(form) {
        document.querySelector("body").classList.add("no-scroll");
        form.style.display = "block";
        setTimeout(() => {
          form.classList.add("is-visible");
        }, 50);
      }

      const closeTriggers = document.querySelectorAll("[data-form-close]");

      closeTriggers.forEach((trigger) => {
        trigger.addEventListener("click", () => {
          const type = trigger.dataset.formClose;

          const form = document.querySelector(`[data-form-block='${type}']`);

          if (form) closeForm(form);
          else console.error(`Form:${type} not found!`);
        });
      });

      function closeForm(form) {
        document.querySelector("body").classList.remove("no-scroll");
        form.classList.remove("is-visible");
        setTimeout(() => {
          form.style.display = "none";
        }, 300);
      }

      // if (window.location.href.includes("/hire")) addEnterHandler();
    })();
  })();
})();

// document.addEventListener("DOMContentLoaded", function () {});

window.addEventListener("load", function () {
  trackVisibility();
  textRotateAnimation();

  document.body.classList.add("page-loaded");

  setTimeout(() => this.document.body.classList.add("delay-complete"), 3000);

  // initTech();

  if (
    window.innerWidth >= 992 &&
    document.querySelector(".process_component")
  ) {
    // initProcess();
  }

  pageResize(); // only due to mobile only sliders fix - https://codepen.io/aaronkahlhamer/pen/GveaXP

  // Call the function to initialize popovers
  initializePopovers();
});

async function initTech() {
  const techContainer = document.querySelector(".tech-matter_container");

  if (!techContainer) return;

  // await loadScript(
  //   "https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js"
  // );

  const options = {};
  const observer = new IntersectionObserver(function (entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        renderTech(techContainer);

        observer.unobserve(entry.target);
      }
    });
  }, options);

  observer.observe(techContainer);
}

function renderTech(matterContainer) {
  if (!matterContainer) return;

  const THICCNESS = 60;
  const width = window.innerWidth;
  const isMobile = width <= 767;
  const isTablet = width < 992 && width > 767;
  const circleY = isMobile ? -200 : -300;

  // module aliases
  var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

  // create an engine
  var engine = Engine.create();

  // create a renderer
  var render = Render.create({
    element: matterContainer,
    engine: engine,
    options: {
      width: matterContainer.clientWidth,
      height: matterContainer.clientHeight,
      background: "transparent",
      wireframes: false,
      showAngleIndicator: false,
      pixelRatio: "auto",
    },
  });

  [...document.querySelectorAll(".tech-matter_logos img")].forEach(function (
    img
  ) {
    let radius = 62;
    let scale = 1.2;
    if (isTablet) {
      radius = 52;
      scale = 1;
    }
    if (isMobile) {
      radius = 29;
      scale = 0.57;
    }

    const circleX = Math.floor(Math.random() * matterContainer.clientWidth);

    let circle = Bodies.circle(circleX, circleY, radius ? radius : 100, {
      friction: 0.3,
      restitution: 0.2,
      render: {
        sprite: {
          texture: img.src,
          yScale: scale ? scale : 2,
          xScale: scale ? scale : 2,
        },
      },
    });
    Composite.add(engine.world, circle);
  });

  var ground = Bodies.rectangle(
    matterContainer.clientWidth / 2,
    matterContainer.clientHeight + THICCNESS / 2,
    1500,
    THICCNESS,
    { isStatic: true, opacity: 0 }
  );

  let leftWall = Bodies.rectangle(
    0 - THICCNESS / 2,
    matterContainer.clientHeight / 2,
    THICCNESS,
    matterContainer.clientHeight * 5,
    {
      isStatic: true,
    }
  );

  let rightWall = Bodies.rectangle(
    matterContainer.clientWidth + THICCNESS / 2,
    matterContainer.clientHeight / 2,
    THICCNESS,
    matterContainer.clientHeight * 5,
    { isStatic: true }
  );

  let topWall = Bodies.rectangle(
    matterContainer.clientWidth / 2,
    0,
    1500,
    THICCNESS,
    {
      isStatic: true,
    }
  );

  ground.render.opacity = 0;
  leftWall.render.opacity = 0;
  rightWall.render.opacity = 0;
  topWall.render.opacity = 0;

  // add all of the bodies to the world
  Composite.add(engine.world, [ground, leftWall, rightWall]);

  let mouse = Matter.Mouse.create(render.canvas);
  let mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
  });

  Composite.add(engine.world, mouseConstraint);

  // allow scroll through the canvas
  mouseConstraint.mouse.element.removeEventListener(
    "mousewheel",
    mouseConstraint.mouse.mousewheel
  );
  mouseConstraint.mouse.element.removeEventListener(
    "DOMMouseScroll",
    mouseConstraint.mouse.mousewheel
  );

  Render.run(render);

  // create runner
  var runner = Runner.create();

  // run the engine
  Runner.run(runner, engine);

  if (width > 992) {
    setTimeout(function () {
      Composite.add(engine.world, [topWall]);
    }, 2000);
  } else {
    setTimeout(function () {
      Composite.add(engine.world, [topWall]);
    }, 3500);
  }
}

function trackVisibility() {
  const elements = document.querySelectorAll("[data-track-visibility]");

  if (!elements.length) return;

  const options = {};
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      } else {
        entry.target.classList.remove("is-visible");
      }
    });
  }, options);

  elements.forEach((el) => observer.observe(el));
}

function textRotateAnimation() {
  const textWrap = document.querySelectorAll(".rotate-text_wrap");

  textWrap.forEach((wrap) => {
    const target = wrap.querySelector(".rotate-text_target");
    const elements = target.dataset.list.split(",");

    target.dataset.activeEl = 0;

    const showNext = () => {
      const activeEl = +target.dataset.activeEl;
      let nextEl;

      if (elements.length === +target.dataset.activeEl) {
        console.log("reached last");
        nextEl = 1;
      } else nextEl = activeEl + 1;

      const element = document.createElement("span");
      element.innerText = elements[nextEl - 1];
      element.style.opacity = 0;
      element.style.transition = "250ms opacity";
      // element.classList = "text-gradient-primary";

      target.innerHTML = "";

      target.insertAdjacentElement("beforeend", element);

      setTimeout(() => {
        element.style.opacity = 1;
      }, 50);

      target.dataset.activeEl = nextEl;
    };

    setInterval(() => {
      if (wrap.classList.contains("is-visible")) showNext();
    }, 2000);

    showNext();
  });
}

let sliders;
// Swiper.js
(() => {
  // window.addEventListener("load", async function () {

  const sliderWrapperEls = Array.from(
    document.querySelectorAll(".swiper-component")
  );

  console.log(sliderWrapperEls);

  if (!sliderWrapperEls.length) return;

  // if (sliderWrapperEls[0].closest(".hide-desktop") && window.innerWidth > 991)
  //   return;

  // if (sliderWrapperEls[0].dataset.mobileOnly && window.innerWidth > 991)
  //   return;

  // await loadScript(
  //   "https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.js"
  // );

  sliders = initSlider(sliderWrapperEls);

  console.log(sliders);

  // if (window.innerWidth <= 478) addReadMore(sliders);

  function initSlider(sliderWrapperEls) {
    // Initialize swiper sliders
    const sliders = [];

    sliderWrapperEls.forEach((wrapperEl) => {
      const swiper = wrapperEl.querySelector(".swiper");

      const slidesPerView = wrapperEl.dataset.slidesPerView
        ? +wrapperEl.dataset.slidesPerView
        : 1;

      const desktopAutoHeight = wrapperEl.dataset.desktopAutoHeight;

      const fadeEffect = wrapperEl.dataset.effectFade ? true : false;

      const loop = wrapperEl.dataset.disableLoop ? false : true;

      const arrows = wrapperEl.querySelectorAll(".swiper-arrow");

      const slider = new Swiper(swiper, {
        updateOnWindowResize: true,
        loop: loop,
        loopAdditionalSlides: 1,
        slidesPerView: slidesPerView,
        spaceBetween: 24,
        speed: 600,
        pagination: {
          el: wrapperEl.querySelector(".swiper-pagination"),
          clickable: true,
          dynamicBullets: true,
        },
        ...(arrows && {
          navigation: {
            prevEl: arrows[0],
            nextEl: arrows[1],
          },
        }),
        breakpoints: {
          0: {
            autoHeight: true,
            slidesPerView: 1,
          },
          992: {
            // autoHeight: desktopAutoHeight ? true : false,
            autoHeight: true,
            slidesPerView: slidesPerView,
          },
        },
        ...(fadeEffect && {
          effect: "fade",
          fadeEffect: {
            crossFade: true,
          },
        }),
      });

      sliders.push(slider);

      sliders.forEach((slider) => {
        slider.on("slideChange", function () {
          if (window.gsap !== undefined) ScrollTrigger.refresh();
        });
      });
    });

    return sliders;
  }

  // Add read more to reviews
  function addReadMore(sliders) {
    const reviewEls = document.querySelectorAll(".review_text");

    if (!reviewEls.length) return;

    const createReadMoreEl = function (reviewEl) {
      const readMoreEl = document.createElement("div");
      readMoreEl.classList.add("review_read-more");
      readMoreEl.textContent = "Read more";
      readMoreEl.addEventListener("click", function () {
        reviewEl.classList.remove("is-long");
        readMoreEl.remove();
        sliders.forEach((slider) => slider.update());
      });

      return readMoreEl;
    };

    reviewEls.forEach((reviewEl) => {
      if (reviewEl.clientHeight >= 145) {
        reviewEl.classList.add("is-long");
        reviewEl.insertAdjacentElement("afterend", createReadMoreEl(reviewEl));
      }
    });
  }
})();

function pageResize() {
  const debounce = (callback, wait) => {
    let timeoutId = null;
    return (...args) => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        callback.apply(null, args);
      }, wait);
    };
  };

  const initialWidth = window.innerWidth;

  const desktop = initialWidth >= 992;
  const tablet = initialWidth < 992 && initialWidth > 767;
  const mobilePotrait = initialWidth <= 767 && initialWidth > 478;
  const mobile = initialWidth <= 478;

  const handleresize = debounce((ev) => {
    const curWidth = window.innerWidth;

    if (desktop && curWidth < 992) {
      location.reload();
    }
    if (tablet && (curWidth >= 992 || curWidth <= 767)) {
      location.reload();
    }
    if (mobilePotrait && (curWidth > 767 || curWidth <= 478)) {
      location.reload();
    }
    if (mobile && curWidth > 478) {
      location.reload();
    }
  }, 250);

  window.addEventListener("resize", handleresize);
}

function initializePopovers() {
  // Select all elements with the popover data attribute
  const popovers = document.querySelectorAll("[data-popover]");

  popovers.forEach((popover) => {
    // Find the child element (content) within each popover
    const content = popover.querySelector("[data-popover-content]");

    // Set initial state
    content.style.opacity = "0";
    content.style.visibility = "hidden";
    content.style.transition = "opacity 0.3s, visibility 0.3s";

    // Function to show the popover content
    const showPopover = () => {
      content.style.opacity = "1";
      content.style.visibility = "visible";
    };

    // Function to hide the popover content
    const hidePopover = () => {
      content.style.opacity = "0";
      content.style.visibility = "hidden";
    };

    // Check if it's a mobile device
    const isMobile = window.matchMedia("(max-width: 991px)").matches;

    if (isMobile) {
      // For mobile: Use click events
      let isOpen = false;

      popover.addEventListener("click", (e) => {
        e.preventDefault();
        if (isOpen) {
          hidePopover();
        } else {
          showPopover();
        }
        isOpen = !isOpen;
      });

      // Close popover when clicking outside
      document.addEventListener("click", (e) => {
        if (!popover.contains(e.target)) {
          hidePopover();
          isOpen = false;
        }
      });
    } else {
      // For desktop: Use hover events
      popover.addEventListener("mouseenter", showPopover);
      popover.addEventListener("mouseleave", hidePopover);
    }
  });
}

// additional code
(() => {
  // hide sel-signup CTA
  try {
    if (URLParams.get("utm_medium") !== "paid-social") return;

    const buttons = [
      ...document.querySelectorAll(".button_primary.is-sec"),
    ].filter(
      (link) =>
        link.href.includes("client.micro1.ai") ||
        link.href.includes("d1y3udqq47tapp.amplifyapp.com")
    );

    buttons.forEach((btn) => btn.remove());

    console.log(buttons);
  } catch {
    console.log("Error in hiding sec CTA");
  }
})();

// pre-fill the email in multi-step form, only working for talent for now
(() => {
  const user = customTrackData?.user;

  if (!user?.email) return;

  document
    .querySelectorAll('[data-step-type="email"] input')
    .forEach((input) => (input.value = user.email));
})();
