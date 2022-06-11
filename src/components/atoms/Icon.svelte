<script lang="ts">
  export let name: keyof typeof icons;

  interface Icons {
    [x: string]: {
      inner: string;
    };
  }

  const icons = {
    show: {
      inner: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 306 306"  xml:space="preserve"><g id="expand-more"><polygon points="270.3,58.65 153,175.95 35.7,58.65 0,94.35 153,247.35 306,94.35"/></g></svg>`,
    },
    add: {
      inner: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 7 7" fill="none">
      <path d="M3.5 0C1.56695 0 0 1.56695 0 3.5C0 5.43305 1.56695 7 3.5 7C5.43305 7 7 5.43305 7 3.5C7 1.56695 5.43305 0 3.5 0ZM4.9 3.85H3.85V4.9C3.85 5.0932 3.6932 5.25 3.5 5.25C3.3068 5.25 3.15 5.0932 3.15 4.9V3.85H2.1C1.9068 3.85 1.75 3.6932 1.75 3.5C1.75 3.3068 1.9068 3.15 2.1 3.15H3.15V2.1C3.15 1.9068 3.3068 1.75 3.5 1.75C3.6932 1.75 3.85 1.9068 3.85 2.1V3.15H4.9C5.0932 3.15 5.25 3.3068 5.25 3.5C5.25 3.6932 5.0932 3.85 4.9 3.85Z" fill="black"/>
      </svg>`,
    },
    add_b: {
      inner: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M11.0833 7.58342H7.58329V11.0834H6.41663V7.58342H2.91663V6.41675H6.41663V2.91675H7.58329V6.41675H11.0833V7.58342Z" fill="black"/>
      </svg>`,
    },
  } as Icons;
</script>

{@html icons[name].inner}
