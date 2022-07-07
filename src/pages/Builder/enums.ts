export const ENUMS = {
  EVENTS: {
    RESIZE: "resize",
  },
  USER_SITE_EVENTS: {
    ADD_TO_PARENT: "ADD_TO_PARENT",
    CHANGE_LOCATION: "CHANGE_LOCATION",
    UPDATE_STYLE: "UPDATE_STYLE",
    SET_ATTRIBUTE: "SET_ATTRIBUTE",
    CHANGE_NODE_TAG: "CHANGE_NODE_TAG",
    REMOVE_ATTRIBUTE: "REMOVE_ATTRIBUTE",
  },
  CSS_CLASS: {
    EMPTY_SITE_COMPONENT: "b-empty",
  },
  DATA_ID: "data-id",
  ELEMENTS: {
    Basic: [
      { label: "Div", tag: "div" },
      { label: "Section", tag: "section" },
      { label: "Image", tag: "img" },
      { label: "Anchor", tag: "a" },
      { label: "Button", tag: "button" },
      { label: "Video", tag: "video" },
      { label: "Paragraph", tag: "p" },
      { label: "Span", tag: "span" },
    ],
    Sections: [
      { label: "Footer", tag: "footer" },
      { label: "Header", tag: "header" },
      { label: "Main", tag: "main" },
      { label: "Aside", tag: "aside" },
    ],
    Headings: [...new Array(6).keys()].map((key) => ({
      label: `Heading ${key + 1}`,
      tag: `h${key + 1}`,
    })),
    Form: [
      { label: "Form", tag: "form" },
      { label: "Input", tag: "input" },
      { label: "Text area", tag: "textarea" },
      { label: "Select", tag: "select" },
      { label: "Option", tag: "option" },
      { label: "Label", tag: "label" },
    ],
    Table: [
      { label: "Table", tag: "table" },
      { label: "Table body", tag: "tbody" },
      { label: "Table row", tag: "tr" },
      { label: "Table data", tag: "td" },
      { label: "Table head cell", tag: "th" },
      { label: "Table head", tag: "thead" },
    ],
    List: [
      { label: "Unordered list", tag: "ul" },
      { label: "Ordered list", tag: "ol" },
      { label: "List item", tag: "li" },
    ],
  },
};
