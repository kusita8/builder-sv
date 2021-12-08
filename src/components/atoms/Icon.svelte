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
      inner: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26" fill="none">
      <path d="M13 1.625C19.3375 1.625 24.375 6.6625 24.375 13C24.375 19.3375 19.3375 24.375 13 24.375C6.6625 24.375 1.625 19.3375 1.625 13C1.625 6.6625 6.6625 1.625 13 1.625ZM13 0C5.85 0 0 5.85 0 13C0 20.15 5.85 26 13 26C20.15 26 26 20.15 26 13C26 5.85 20.15 0 13 0Z" fill="black"></path><path d="M21.125 11.375H14.625V4.875H11.375V11.375H4.875V14.625H11.375V21.125H14.625V14.625H21.125V11.375Z" fill="black"></path></svg>`,
    },
  } as Icons;
</script>

{@html icons[name].inner}

<style type="text/scss">
  /* your styles go here */
</style>
