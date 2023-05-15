const data = [
  {
    title: "Day of the Dragon",
    author: "Richard A. Knaak",
    quantity: 10,
    unit_price: 9,
    total_value: null,
  },
  {
    title: "A Wizard of Earthsea",
    author: "Ursula K. Le Guin",
    quantity: null,
    unit_price: 10,
    total_value: 40,
  },
  {
    title: "Homeland",
    author: "Robert A. Salvatore",
    quantity: 8,
    unit_price: null,
    total_value: 96,
  },
  {
    title: "Canticle",
    author: "Robert A. Salvatore",
    quantity: 13,
    unit_price: 23,
    total_value: null,
  },
  {
    title: "Gamedec. Granica rzeczywistości",
    author: "Marcin Przybyłek",
    quantity: null,
    unit_price: 25,
    total_value: 50,
  },
  {
    title: "The Night Has Come",
    author: "Stephen King",
    quantity: 30,
    unit_price: null,
    total_value: 900,
  },
  {
    title: "The Sphinx",
    author: "Graham Masterton",
    quantity: 3,
    unit_price: null,
    total_value: 300,
  },
  {
    title: "Charnel House",
    author: "Graham Masterton",
    quantity: null,
    unit_price: 20,
    total_value: 60,
  },
  {
    title: "The Devils of D-Day",
    author: "Graham Masterton",
    quantity: 10,
    unit_price: 16,
    total_value: null,
  },
];
const metadata = [
  {
    id: "title",
    type: "string",
    label: "Title",
  },
  {
    id: "author",
    type: "string",
    label: "Author",
  },
  {
    id: "quantity",
    type: "number",
    label: "Quantity",
  },
  {
    id: "unit_price",
    type: "number",
    label: "Unit price",
  },
  {
    id: "total_value",
    type: "number",
    label: "Total (Quantity * Unit price)",
  },
];

const additionalDataFromBooksDB = [
  {
    title: "Day of the Dragon",
    author: "Richard A. Knaak",
    genre: "fantasy",
    pages: 378,
    rating: 3.81,
  },
  {
    title: "A Wizard of Earthsea",
    author: "Ursula K. Le Guin",
    genre: "fantasy",
    pages: 183,
    rating: 4.01,
  },
  {
    title: "Homeland",
    author: "Robert A. Salvatore",
    genre: "fantasy",
    pages: 343,
    rating: 4.26,
  },
  {
    title: "Canticle",
    author: "Robert A. Salvatore",
    genre: "fantasy",
    pages: 320,
    rating: 4.03,
  },
  {
    title: "Gamedec. Granica rzeczywistości",
    author: "Marcin Przybyłek",
    genre: "cyberpunk",
    pages: 364,
    rating: 3.89,
  },
  {
    title: "The Night Has Come",
    author: "Stephen King",
    genre: "post apocalyptic",
    pages: 186,
    rating: 4.55,
  },
  {
    title: "The Sphinx",
    author: "Graham Masterton",
    genre: "horror",
    pages: 207,
    rating: 3.14,
  },
  {
    title: "Charnel House",
    author: "Graham Masterton",
    genre: "horror",
    pages: 123,
    rating: 3.61,
  },
  {
    title: "The Devils of D-Day",
    author: "Graham Masterton",
    genre: "horror",
    pages: 243,
    rating: "3.62",
  },
];
const additionalMetadataFromBooksDB = [
  {
    id: "title",
    type: "string",
    label: "Title",
  },
  {
    id: "author",
    type: "string",
    label: "Author",
  },
  {
    id: "genre",
    type: "string",
    label: "Genre",
  },
  {
    id: "pages",
    type: "number",
    label: "Pages",
  },
  {
    id: "rating",
    type: "number",
    label: "Rating",
  },
];

const searchInputElement = document.body.querySelector("input.search-input");
const searchButtonElement = document.body.querySelector("button.search-go");
const searchResetElement = document.body.querySelector("button.search-reset");

const columnHideElement = document.body.querySelector("button.column-hide");
const columnShowElement = document.body.querySelector("button.column-show");
const columnResetElement = document.body.querySelector("button.column-reset");

const markButtonElement = document.body.querySelector("button.function-mark");
const fillButtonElement = document.body.querySelector("button.function-fill");
const countButtonElement = document.body.querySelector("button.function-count");
const computeTotalsButtonElement = document.body.querySelector(
  "button.function-totals"
);
const resetFunctionButtonElement = document.body.querySelector(
  "button.function-reset"
);

class Grid {
  constructor() {
    this.data = data;
    this.metadata = metadata;

    // Initialize all columns as visible
    this.columnVisibility = Array(this.metadata.length).fill(true);

    // HINT: below map can be useful for view operations ;))
    this.dataViewRef = new Map();

    Object.freeze(this.data);
    Object.freeze(this.metadata);

    this.render();
    this.live();
  }

  render() {
    this.table = document.createElement("table");

    this.head = this.table.createTHead();
    this.body = this.table.createTBody();

    this.renderHead();
    this.renderBody();

    document.body.append(this.table);
  }

  renderHead() {
    const row = this.head.insertRow();

    for (const column of this.metadata) {
      const cell = row.insertCell();

      cell.innerText = column.label;
    }
  }

  renderBody() {
    for (const dataRow of this.data) {
      const row = this.body.insertRow();

      for (const column of this.metadata) {
        const cell = row.insertCell();

        cell.classList.add(column.type);
        cell.innerText = dataRow[column.id];
      }

      // connect data row reference with view row reference
      this.dataViewRef.set(dataRow, row);
    }
  }

  live() {
    searchButtonElement.addEventListener("click", this.onSearchGo.bind(this));
    // Commented it because of choose another way to filtering rows
    // searchInputElement.addEventListener(
    //   "keydown",
    //   this.onSearchChange.bind(this)
    // );
    searchResetElement.addEventListener("click", this.onSearchReset.bind(this));

    columnHideElement.addEventListener(
      "click",
      this.onColumnHideClick.bind(this)
    );
    columnShowElement.addEventListener(
      "click",
      this.onColumnShowClick.bind(this)
    );
    columnResetElement.addEventListener("click", this.onColumnReset.bind(this));

    markButtonElement.addEventListener(
      "click",
      this.onMarkEmptyClick.bind(this)
    );
    fillButtonElement.addEventListener(
      "click",
      this.onFillTableClick.bind(this)
    );
    countButtonElement.addEventListener(
      "click",
      this.onCountEmptyClick.bind(this)
    );
    computeTotalsButtonElement.addEventListener(
      "click",
      this.onComputeTotalsClick.bind(this)
    );
    resetFunctionButtonElement.addEventListener(
      "click",
      this.onFunctionsResetClick.bind(this)
    );
  }

  onSearchGo(event) {
    // Remove whitespaces and uppercase to improve filtering
    const query = searchInputElement.value.toLowerCase().trim();

    for (const [dataRow, row] of this.dataViewRef.entries()) {
      // Find the rows which match to search value
      const rowMatchesSearch = this.metadata.some((column) => {
        if (!dataRow[column.id]) {
          return false;
        }
        const cellValue = dataRow[column.id].toString().toLowerCase().trim();
        return cellValue.includes(query);
      });

      // Display query rows and hide another
      row.style.display = rowMatchesSearch ? "" : "none";
    }

    event.preventDefault();
  }

  // Commented it because of choose another way to filtering rows
  //   onSearchChange(event) {
  //     console.error(`Search button pressed...`);
  //   }

  onSearchReset() {
    // Clear search input
    searchInputElement.value = "";

    // Show all initial rows
    for (const [_, row] of this.dataViewRef.entries()) {
      row.style.display = "";
    }
  }

  onColumnHideClick(event) {
    for (let i = 0; i < this.metadata.length; i++) {
      if (this.columnVisibility[i]) {
        this.hideColumn(i);
        break;
      }
    }
  }

  onColumnShowClick(event) {
    // Find the first hidden column and show it
    for (let i = 0; i < this.metadata.length; i++) {
      if (!this.columnVisibility[i]) {
        this.showColumn(i);
        break;
      }
    }
  }

  onColumnReset(event) {
    // Show all columns and reset visibility status
    for (let i = 0; i < this.metadata.length; i++) {
      this.showColumn(i);
      this.columnVisibility[i] = true;
    }
  }

  onMarkEmptyClick(event) {
    // Loop through all rows in the table
    for (const [dataRow, row] of this.dataViewRef.entries()) {
      for (const column of this.metadata) {
        // Check if the column is numeric and the value is empty
        if (column.type === "number" && !dataRow[column.id]) {
          // Add the .bordered class to the cell
          const cell = row.cells[this.metadata.indexOf(column)];
          cell.classList.add("bordered");
        }
      }
    }
  }

  onFillTableClick(event) {
    // Loop through all rows in the table
    for (const [dataRow, row] of this.dataViewRef.entries()) {
      for (const column of this.metadata) {
        // Check if the column is numeric and the value is empty
        if (column.type === "number" && !dataRow[column.id]) {
          const cell = row.cells[this.metadata.indexOf(column)];
          if (column.id === "quantity" || column.id === "unit_price") {
            const totalNum = dataRow.total_value;
            const divider = dataRow.quantity
              ? dataRow.quantity
              : dataRow.unit_price;
            cell.textContent = totalNum / divider;
          }
          if (column.id === "total_value") {
            const multiplier1 = dataRow.quantity;
            const multiplier2 = dataRow.unit_price;
            cell.textContent = multiplier1 * multiplier2;
          }
        }
      }
    }
  }

  onCountEmptyClick(event) {
    console.error(`Counting amount of empty cells...`);
  }

  onComputeTotalsClick(event) {
    console.error(`Computing summary totals...`);
  }

  onFunctionsResetClick(event) {
    for (const [dataRow, row] of this.dataViewRef.entries()) {
      for (const column of this.metadata) {
        // Check if the column is numeric and the value is empty
        if (column.type === "number" && !dataRow[column.id]) {
          // Add the .bordered class to the cell
          const cell = row.cells[this.metadata.indexOf(column)];
          cell.classList.remove("bordered");
        }
      }
    }
  }

  // Helper functions to hide and show column
  hideColumn(columnIndex) {
    for (const [_, row] of this.dataViewRef.entries()) {
      row.cells[columnIndex].style.display = "none";
    }
    this.head.rows[0].cells[columnIndex].style.display = "none";
    this.columnVisibility[columnIndex] = false;
  }

  showColumn(columnIndex) {
    for (const [_, row] of this.dataViewRef.entries()) {
      row.cells[columnIndex].style.display = "";
    }
    this.head.rows[0].cells[columnIndex].style.display = "";
    this.columnVisibility[columnIndex] = true;
  }
}

new Grid();
