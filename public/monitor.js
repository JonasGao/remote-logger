const buildRow1 = () => {
  const tr = document.createElement("tr");
  const td0 = document.createElement("td");
  const td1 = document.createElement("td");
  const [code0, set0] = buildCode();
  const [code1, set1] = buildCode();
  tr.append(td0, td1);
  td0.append(code0);
  td1.append(code1);
  return [tr, set0, set1];
};

const buildCode = () => {
  const code = document.createElement("code");
  const pre = document.createElement("pre");
  code.appendChild(pre);
  return [code, pre.append.bind(pre)];
};

const buildContainer = () => {
  const div = document.createElement("div");
  div.classList.add("container");
  return div;
};

const buildCol = index => {
  const div = document.createElement("div");
  div.classList.add("col", "col" + index);
  const [code, setCodeText] = buildCode();
  div.appendChild(code);
  return [div, setCodeText];
};

const buildRow = count => {
  let row = [];
  for (let i = 0; i < count; i++) {
    row.push(buildCol(i));
  }
  return row;
};

const COL_COUNT = 6;

class LogList extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.container = buildContainer();
    const style = document.createElement("style");
    style.textContent = `
      * {
        padding: 0;
        margin: 0;
      }
      .container {
        display: grid;
        grid-template-columns: repeat(${COL_COUNT}, auto);
      }
      .col0,.col2,.col4 {
        background: #eaeaea;
      }
      .col {
        padding-left: 10px;
        padding-right: 10px;
      }
    `;
    this.shadow.append(style, this.container);
  }

  addRow() {
    const rows = buildRow(COL_COUNT);
    const cols = rows.map(i => i[0])
    const setters = rows.map(i => i[1])
    this.container.append(...cols);
    return setters;
  }
}

customElements.define("log-list", LogList);
