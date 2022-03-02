const myForm = document.getElementById("myForm");
const csvFile = document.getElementById("csvFile");
const prefixInput = document.getElementById("prefix");
const result = document.getElementById("result");

function csvToArray(str, delimiter = ";") {
  const headers = str.slice(0, str.indexOf("\r\n")).split(delimiter);
  const rows = str
    .slice(str.indexOf("\n") + 1)
    .split("\r\n")
    .filter(Boolean);
  const arr = rows.map(function (row) {
    const values = row.split(delimiter);
    const el = headers.reduce(function (object, header, index) {
      object[header] = values[index];
      return object;
    }, {});
    return el;
  });
  return arr;
}

myForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const prefix = prefixInput.value;
  const input = csvFile.files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    const data = csvToArray(e.target.result);
    let updatedData;
    let count = 0;
    for (let index = 0; index < data.length; index++) {
      if (updatedData != undefined) {
        if (data[index].region == data[index - 1].region) {
          updatedData =
            updatedData + `   ${prefix}.addItem("${data[index].branch}");\n`;
          if (index + 1 == data.length) {
            updatedData = updatedData + "break;\n";
          }
        } else {
          updatedData = updatedData + "break;\n";
          updatedData =
            updatedData + `case "${count}": //${data[index].region}\n`;
          updatedData = updatedData + `   ${prefix}.rawValue = "";\n`;
          updatedData = updatedData + `   ${prefix}.clearItems();\n`;
          updatedData =
            updatedData + `   ${prefix}.addItem("${data[index].branch}");\n`;
          if (index + 1 == data.length) {
            updatedData = updatedData + "break;\n";
          }
          count++;
        }
      } else {
        updatedData = `case "${count}": //${data[index].region}\n`;
        updatedData = updatedData + `   ${prefix}.rawValue = "";\n`;
        updatedData = updatedData + `   ${prefix}.clearItems();\n`;
        updatedData =
          updatedData + `   ${prefix}.addItem("${data[index].branch}");\n`;
        count++;
      }
    }
    result.innerHTML = updatedData;
    hljs.highlightAll();
  };
  reader.readAsText(input, "windows-1250");
});
