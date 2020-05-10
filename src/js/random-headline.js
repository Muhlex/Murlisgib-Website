document.addEventListener('DOMContentLoaded', () => {
  const subheadingEl = document.querySelector(".hero__subheading");

  let firstWord = undefined;
  switch (Math.floor(Math.random() * 5)) {
    case 0:
      firstWord = "Banana";
      break;

    case 1:
      firstWord = "Orange";
      break;

    default:
      firstWord = "Melon";
      break;
  }

  subheadingEl.innerHTML = `${firstWord} ${subheadingEl.innerHTML.split(' ').slice(1).join(' ')}`;
});
