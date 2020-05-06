function selectEl(element) {
  const select = window.getSelection();
  const range = document.createRange();

  range.selectNodeContents(element);
  select.addRange(range);
}

document.addEventListener('DOMContentLoaded', () => {
  const serverRootEls = document.querySelectorAll(".servers__server");
  const serverEls = Array.from(serverRootEls).map(serverRootEl => {
    return {
      main: serverRootEl.querySelector(".servers__main"),
      expanded: serverRootEl.querySelector(".servers__expand"),
      ip: serverRootEl.querySelector(".servers__ip"),
      iptext: serverRootEl.querySelector(".servers__iptext"),
      ipbtn: serverRootEl.querySelector(".servers__ipbtn"),
    };
  });

  serverEls.forEach(({ main, ip, iptext, ipbtn }, index) => {
    // expand server
    main.addEventListener("click", () => {
      serverRootEls[index].classList.toggle("expanded");
      serverRootEls.forEach(el => {
        if (el !== serverRootEls[index]) el.classList.remove("expanded");
      });
    });

    // select ip on click
    ip.addEventListener("click", event => {
      selectEl(iptext);

      if (event.target !== ipbtn) return;
      // copy ip on button click
      if (document.execCommand('copy')) {
        ipbtn.classList.add("clicked");
        event.stopImmediatePropagation();
        document.addEventListener("click", () => {
          ipbtn.classList.remove("clicked");
        });
      }
    });
  });
});
