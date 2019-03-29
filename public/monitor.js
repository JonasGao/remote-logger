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
  div.classList.add("log-list__container");
  return div;
};

const buildCol = index => {
  const div = document.createElement("div");
  div.classList.add("log-list__col", "log-list__col" + index);
  const [code, setCodeText] = buildCode();
  div.appendChild(code);
  return [div, setCodeText];
};

const buildRow = () => {
  return [...buildCol(0), ...buildCol(1)];
};

class LogList extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.container = buildContainer();
    this.shadow.append(this.container);
  }

  addRow() {
    const [col0, set0, col1, set1] = buildRow();
    this.container.append(col0, col1);
    return [set0, set1];
  }
}

customElements.define("log-list", LogList);
