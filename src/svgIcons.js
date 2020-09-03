function svgIcons(icon) {
  return icons[icon]
}

const icons = {
  openInNew: `<a href="" target="_blank">TEXT<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" ><path fill="#1976d2" d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg></a>`,
  openInNew2: `<a id="a" href="" target="_blank">TEXT<IconBase icon-name="targetBlank"><IconTargetBlank /></IconBase></a>`
}

// console.log(svgIcons('openInNew'))

export default svgIcons;
